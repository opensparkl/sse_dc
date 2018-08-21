/**
 * Copyright 2018 SPARKL Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import Type from '@/util/type'
import api from '@/api'
import icons from './icons'

export default {
  props: {
    id: {
      type: String,
      required: true
    },
    nodes: {
      type: Object,
      required: true
    }
  },
  computed: {
    node () {
      return this.nodes[this.id]
    },

    type () {
      return Type.getType(this.node)
    },

    icon () {
      return 'fa fa-fw ' + (icons[this.node.tag] || 'fa-question')
    },

    nodeClass () {
      return [
        'sparkl-node',
        this.node.tag,
        this.type,
        {
          'ghost': this.node.is_ghost
        }
      ]
    }
  },
  methods: {
    getNodeById (id) {
      return this.nodes[id]
    },

    cleanErrors (id) {
      this.$store.commit('deleteErrors', id)
    },

    mouseover () {
      this.$store.state.nodeOverId = this.id
    },

    mouseleave () {
      this.$store.state.nodeOverId = null
    },

    select (id) {
      let node = this.nodes[id]

      if (Type.isPrimary(node.tag)) {
        api.object(node.attr.id)
          .then(response => {
            this.$modal.show('unit-test-modal', {
              node: response.data
            })
          })
          .catch(error => {
            console.warn(error)
          })
      }
    },

    unselect (id) {

    }
  }
}
