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
-->
<template>
  <panel title="Operation">
    <transition name="component-fade">
      <div v-if="visible">
        <div>
          <template v-if="node.attr.service">
            <node-basic :id="node.attr.service"
                        :nodes="cache"/>
          </template>
          <i class="icon ion-arrow-right-a operation-arrow"/>
          <node-operation :id="node.attr.id"
                          :nodes="cache"/>
        </div>
        <div v-if="subr">
          <div class="panel-header"
               style="padding: 10px 0;">
            <div class="panel-title">
              Subroutine
            </div>
          </div>
          <template v-if="subr.attr.service">
            <node-basic :id="subr.attr.service"
                        :nodes="cache"/>
          </template>
          <i class="icon ion-arrow-right-a operation-arrow"/>
          <node-operation :id="subr.attr.id"
                          :nodes="cache"/>
        </div>
      </div>
    </transition>
  </panel>
</template>
<script>
import { mapState } from 'vuex'
import Type from '@/util/type'
import NodeOperation from '../Mix/NodeOperation'
import NodeBasic from '../Mix/NodeBasic'
import api from '@/api'

export default {
  name: 'Operation',
  components: {
    NodeBasic,
    NodeOperation
  },
  data () {
    return {
      debug: true,
      visible: false,
      subrId: null,
      cache: {}
    }
  },
  watch: {
    node: {
      handler: function (node) {
        this.reset()

        if (node && Type.getType('operation')) {
          this.cacheNodes(node.attr.id).then(() => {
            this.visible = true

            if (this.canHaveSubr(node)) {
              api.objectSubr(node.attr.id)
                .then(response => {
                  let content = response.data.content

                  if (content) {
                    let callee = content[0].attr.callee

                    this.cacheNodes(callee).then(() => {
                      this.subrId = callee
                    })
                  }
                })
            }
          })
        }
      },
      immediate: true
    }
  },
  computed: {
    ...mapState([
      'node'
    ]),
    subr () {
      if (this.subrId) {
        return this.cache[this.subrId]
      }
    }
  },
  methods: {
    canHaveSubr (node) {
      return node.tag === 'consume' || node.tag === 'request'
    },

    transformOperation (node) {
      let clone = { ...node }

      if (typeof clone.attr.fields === 'string') {
        clone.attr.fields = clone.attr.fields.split(' ')
      }

      return clone
    },

    reset () {
      this.cache = {}
      this.subrId = null
      this.visible = false
    },

    fetchNodes (list = []) {
      return api.objects(list)
        .then(response => response.data.content || [])
    },

    filterCached (list) {
      let { cache } = this
      return list.filter(v => !cache.hasOwnProperty(v))
    },

    cacheNodes (list = []) {
      if (typeof list === 'string') {
        list = [list]
      }

      return new Promise((resolve, reject) => {
        let uncached = this.filterCached(list)

        if (uncached.length === 0) {
          if (this.debug) {
            console.log('Caching is done..')
          }
          resolve()
          return
        } else {
          if (this.debug) {
            console.log(`Number of not cached nodes: ${uncached.length}`)
          }
        }

        this.fetchNodes(uncached)
          .then(nodes => {
            let externs = []

            nodes.forEach(node => {
              let type = Type.getType(node)

              if (type === 'operation') {
                node = this.transformOperation(node)

                if (node.attr.fields) {
                  externs = externs.concat(node.attr.fields)
                }

                if (node.attr.service) {
                  externs.push(node.attr.service)
                }

                if (node.content) {
                  let replies = node.content
                    .filter(v => Type.isReply(v.tag))
                    .map(this.transformOperation)

                  replies.forEach(reply => {
                    if (reply.attr.fields) {
                      externs = externs.concat(reply.attr.fields)
                    }

                    this.cache[reply.attr.id] = reply
                  })

                  node.content = replies.map(v => v.attr.id)
                }
              }

              this.cache[node.attr.id] = node
            })

            this.cacheNodes(externs)
              .then(resolve)
              .catch(reject)
          })
      })
    }
  }
}
</script>
<style>
.operation-arrow {
  display: inline-block;
  padding: 15px;
  color: #8898A5;
}
</style>
