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
 *
 * Mixin with functions that are used both in TreeNode and TreeNodeTitle.
 */
import { mapState } from 'vuex'

export default {
  data () {
    return {
      allowedTypes: []
    }
  },
  computed: {
    ...mapState([
      'tree'
    ]),

    isService () {
      return this.node.tag === 'service'
    },

    isContainer () {
      return ['folder', 'mix', 'service'].indexOf(this.node.tag) !== -1
    },

    name () {
      return this.node.attr.name || this.node.attr.id
    },

    isSelected () {
      return this.tree.selected === this.node.attr.id
    },

    content () {
      return (this.node.content || [])
        .filter(v => v.tag !== 'prop' && v.tag !== 'grant')
    },

    props () {
      return this.content.filter(v => v.tag === 'prop')
    }
  }
}
