<!--
  Copyright 2018 SPARKL Limited

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.

  Unit Test modal for mix panel.
-->
<template>
  <modal name="unit-test-modal"
         classes="v--modal vue-dialog unit-test-modal"
         :width="400"
         :min-width="300"
         :min-height="220"
         :height="400"
         :pivot-y="0.3"
         :adaptive="true"
         :resizable="true"
         draggable=".dialog-c-title"
         transition="fade"
         @before-open="beforeOpen"
         @before-close="beforeClose">
    <flex-box direction="column"
              class="dialog-flex">
      <flex-box direction="column"
                class="dialog-content"
                v-if="node">
        <div class="dialog-c-title">
          Testing {{node.tag}} "{{node.attr.name}}"
          <transition name="fade">
            <i v-if="loading"
               class="fa fa-fw fa-spinner fa-pulse"/>
          </transition>
        </div>
        <flex-box direction="column"
                  class="dialog-c-text">
          <div style="width: 100%; flex: 0 1 auto; padding-bottom: 10px; border-bottom: 1px solid #eee;">
            <div v-for="(field, i) in fields"
                 :key="i">
              <div v-if="field.type === 'binary'">
                <div>
                  <b>{{field.name}}</b>
                </div>
                <input-binary-field
                  :field="field"
                  @change="onBinaryFieldChange(field, $event)"/>
              </div>
              <div v-else>
                <div>
                  <b>{{field.name}}</b>
                </div>
                <input
                  :placeholder="field.type"
                  v-model="field.value"
                  class="unit-test-input">
              </div>
            </div>
          </div>

          <div v-if="response || error" class="response-data">
            <template v-if="response">
              <div class="response-title">
                <span style="text-transform: capitalize">{{response.tag}}: </span>
                <span>{{response.name}}</span>
              </div>
              <div v-for="(datum, i) in response.content"
                   v-if="datum.content"
                   style="padding: 10px 0;"
                   :key="i">
                <div>
                  <b>{{renderDatumName(datum)}}</b>
                </div>
                <div>
                  <span v-html="renderDatumValue(datum)">
                  </span>
                </div>
              </div>
            </template>
            <div v-if="error"
                 style="white-space: pre; color: #EE5332">{{error}}</div>
          </div>
        </flex-box>
      </flex-box>
      <div class="dialog-buttons">
        <button style="width: 50%" @click="cancel">
          Cancel
        </button>
        <button style="width: 50%" @click="test">
          Test
        </button>
      </div>
    </flex-box>
  </modal>
</template>
<script>
import { mapState } from 'vuex'
import api from 'src/api'
import InputBinaryField from '../elements/InputBinaryField'

export default {
  name: 'UnitTestModal',
  components: {
    InputBinaryField
  },
  data () {
    return {
      node: null,
      fields: [],
      cache: {},
      loading: false,
      response: null,
      error: null
    }
  },
  computed: {
    ...mapState([
      'tree'
    ])
  },
  methods: {
    onBinaryFieldChange (field, event) {
      this.$set(field, 'value', event.value)
    },

    beforeOpen (event) {
      this.node = event.params.node

      let fieldsString = this.node.attr.fields || ''
      let fieldsArray = fieldsString.split(' ').filter(v => v)

      this.getFieldList(fieldsArray)
        .then(fields => {
          this.fields = fields
            .filter(field => {
              return field.type && field.type !== 'FLAG'
            })
            .map(field => {
              return { ...field, valie: '' }
            })
        })
        .catch(errors => {
          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Error',
            text: errors
          })
        })
    },

    getFieldForDatum (datum) {
      return this.cache[datum.attr.field]
    },

    renderDatumName (datum) {
      return this.getFieldForDatum(datum).attr.name
    },

    renderDatumValue (datum) {
      let field = this.getFieldForDatum(datum)
      let type = field.attr.type
      let value = (datum.content && datum.content[0]) || ''

      if (type === 'binary') {
        if (Array.isArray(field.content)) {
          let mimeProp = field.content
            .find(v => v.attr.name === 'mime-type')

          if (mimeProp) {
            let mime = mimeProp.attr.value

            if (typeof mime === 'string' && mime.indexOf('audio') === 0) {
              return `
                <audio
                    controls
                    style="width: 100%"
                    type="${mime}"
                    src="data:${mime};base64,${value}">
                </audio>
              `
            }
          }
        }
      }

      return value || '(empty)'
    },

    createSparklId () {
      let time = Date.now().toString(36)
      let random = Math.random().toString(36)

      return [
        'n',
        time.substr(-3),
        random.substr(-3),
        random.substr(2, 3)
      ].join('-').toUpperCase(0)
    },

    getObject (id) {
      return new Promise((resolve, reject) => {
        if (this.cache[id]) {
          resolve(this.cache[id])
        }

        api.object(id)
          .then(response => {
            this.cache[id] = response.data
            resolve(this.cache[id])
          })
          .catch(reject)
      })
    },

    getFieldList (indexes) {
      let promises = indexes.map(v => this.getObject(v))

      return Promise.all(promises)
        .then(fields => fields.map(f => f.attr))
    },

    createSparklEvent () {
      let { fields, node, createSparklId } = this
      let content = fields.map(field => {
        return {
          tag: 'datum',
          attr: {
            field: field.id
          },
          content: [
            field.value
          ]
        }
      })

      return {
        tag: 'data_event',
        attr: {
          id: createSparklId(),
          subject: node.attr.id
        },
        content
      }
    },

    beforeClose () {
      this.node = null
      this.response = null
      this.error = null
      this.cache = {}
      this.fields = []
    },

    getErrorMessage (error) {
      let message = 'Error:'

      if (error.attr) {
        for (var i in error.attr) {
          let value = error.attr[i]
          message += `\n${i}: ${JSON.stringify(value)}`
        }
      } else {
        message += JSON.stringify(error, null, 2)
      }

      return message
    },

    test () {
      let event = this.createSparklEvent()
      let tag = this.node.tag

      this.response = null
      this.error = null
      this.loading = true

      api.dispatch(tag, event)
        .then(response => {
          let { data } = response
          let content = data.content || []

          if (data.tag === 'error_event') {
            let error = content[0]
            let message = this.getErrorMessage(error)

            if (data.attr.subject) {
              this.getObject(data.attr.subject).then(v => {
                message += `\n\nSubject:\n<${v.tag}> ${v.attr.name}`
                message += `\n\nPath:\n${v.attr.path}`

                this.error = message
              })
            } else {
              this.error = message
            }

            this.loading = false
            return
          }

          let isSimpleConsume = false

          if (tag === 'consume') {
            let children = this.node.content

            if (Array.isArray(children)) {
              let replies = children.filter(v => v.tag === 'reply')
              isSimpleConsume = replies.length === 0
            } else {
              isSimpleConsume = true
            }
          }

          if (tag === 'notify' || isSimpleConsume) {
            this.$modal.hide('unit-test-modal')
            this.loading = false
            return
          }

          let indexes = content.map(v => v.attr.field)

          this.getFieldList(indexes).then(fields => {
            let { subject } = data.attr
            let node = this.node.content.find(v => {
              return v.attr.id === subject
            })

            this.response = {
              tag: node.tag,
              name: node.attr.name,
              content
            }
            this.loading = false
          })
        })
        .catch(error => {
          console.warn(error)

          let data = error.response.data

          this.error = this.getErrorMessage(data)
          this.loading = false
        })
    },

    cancel () {
      this.$modal.hide('unit-test-modal')
    }
  }
}
</script>

<style lang="scss">
@import "~styles/_colors.scss";

.unit-test-modal {
  .dialog-c-title {
    width: 100%;
    flex: 0 1 auto;
  }

  .dialog-c-text {
    width: 100%;
    flex: 1 0 auto;
  }

  .response-title {
    font-weight: 600;
    color: $blue;
  }

  .response-data {
    width: 100%;
    flex: 1 0 auto;
    padding-top: 10px;
    overflow-y: auto;
  }
}

.input-list {
  padding-bottom: 10px;
  border-bottom: 1px solid #eee;
}

.unit-test-input {
  width: 100%;
  box-sizing: border-box;

  padding: 6px 4px;
  margin: 0;
  margin-top: 6px;

  background: #f3f3f3;

  border-radius: 3px;
  border: 1px solid #eee;

}
</style>
