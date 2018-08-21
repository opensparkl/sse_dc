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
  <panel title="Mix">
    <mix
      v-if="nodes && node"
      is-root="true"
      :id="node.attr.id"
      :nodes="nodes"/>
  </panel>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api'
import util from '@/util'
import Mix from '@/components/Mix'
import Type from '@/util/type'

export default {
  name: 'MixPanel',
  components: {
    Mix
  },
  data () {
    return {
      operations: [],
      nodes: null
    }
  },
  computed: {
    ...mapState([
      'tree',
      'node'
    ])
  },
  watch: {
    'node': {
      handler: function (n) {
        this.nodes = null
        this.operations = []

        let selected = this.tree.selected

        if (this.node.tag !== 'mix') {
          return
        }

        this.getMix(selected)
          .then(payload => {
            let { extern, mix } = payload

            extern.forEach(v => { v.is_ghost = true })

            let array = mix.concat(extern)
            let nodes = array.reduce(($, item) => {
              if (item.content) {
                /* Filtering props and grants */
                let replies = item.content.filter(Type.isReply)

                item.content = replies.map(v => v.attr.id)
                replies.forEach(v => { $[v.attr.id] = v })
              } else {
                item.content = []
              }

              $[item.attr.id] = item
              return $
            }, {})

            for (var i in nodes) {
              let node = nodes[i]

              if (node.attr.entries) {
                let entries = node.attr.entries.split(' ')
                node.content = node.content.concat(entries)
              }

              /* Breaking fields into array */
              if (node.attr.fields) {
                node.attr.fields = node.attr.fields.split(' ')
              }

              /* Replacing service id with service name */
              if (node.attr.service) {
                let serviceId = node.attr.service
                node.attr.service = nodes[serviceId].attr.name
              }

              /* Adding ghost fiends/services to root folder */
              if (node.is_ghost) {
                nodes[selected].content.push(node.attr.id)
              }
            }

            this.nodes = nodes
          })
          .catch(error => {
            console.warn(error)
          })
      },
      immediate: true
    }
  },
  methods: {
    getMix (id) {
      return new Promise((resolve, reject) => {
        api.mix(id)
          .then(response => {
            let data = response.data
            let externs = util.wsSplit(data.attr.externs || '')
            let promises = externs.map(id => api.object(id))

            Promise.all(promises)
              .then(responses => {
                let externalNodes = responses.map(r => r.data)

                resolve({
                  mix: data.content,
                  extern: externalNodes
                })
              })
              .catch(reject)
          })
          .catch(reject)
      })
    },
    showModal (node) {
      this.$modal.show('unit-test-modal', { node })
    }
  }
}
</script>
<style>
  .mix-iframe {
    box-sizing: border-box;
    width: 100%;
  }
</style>
