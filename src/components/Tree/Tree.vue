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

  TreeView component.

  More: https://en.wikipedia.org/wiki/Tree_view
-->
<template>
  <div v-if="root"
       class="tree">
    <tree-node :node="root"
               :owner="root.owner"/>
  </div>
</template>
<script>
  import TreeNode from './TreeNode'
  import { mapState } from 'vuex'

  export default {
    name: 'Tree',
    components: {
      TreeNode
    },
    beforeMount () {
      window.addEventListener('focus', this.focus)

      if (window.$serializedTree) {
        this.restoreTree()
      } else {
        this.$store.dispatch('fetchTreeRoot', {
          userId: this.user.id
        })
      }
    },
    beforeDestroy () {
      window.removeEventListener('focus', this.focus)
      this.cacheTree()
    },
    methods: {
      cacheTree () {
        window.$serializedTree = JSON.stringify({
          owner: this.user.name,
          selected: this.tree.selected,
          tree: this.root,
          datetime: Date.now()
        })
      },

      restoreTree () {
        let json = JSON.parse(window.$serializedTree)
        let { tree, selected } = json

        if (tree) {
          this.$store.commit('SET_TREE', {
            username: tree.owner,
            root: tree
          })

          if (selected) {
            this.$store.commit('SELECT_TREE_NODE_ID', selected)
            this.$store.dispatch('fetchSelectedTreeNode')
          }

          window.$serializedTree = null
        }
      }
    },
    computed: {
      ...mapState([
        'user',
        'tree',
        'node'
      ]),
      root () {
        return this.tree.roots[this.user.name]
      }
    }
  }
</script>
<style lang="scss">
.tree {
  font-size: 13px;
}
</style>
