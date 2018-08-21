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

  TreeView node renderer.
-->
<template>
  <div class="sparkl-tree-node"
       v-if="!isFiltered"
       :class="className">
    <n-title :node="node"
             :is-opened="node.opened"
             :padding="padding"
             @open="open"/>
    <div v-if="node.opened" class="sparkl-tree-children">
      <tree-node v-for="(node, i) in content"
                 :key="node.tag + node.attr.path"
                 :level="level + 1"
                 :owner="owner"
                 :node="node"/>
    </div>
  </div>
</template>
<script>
import mixin from './mixin'
import NTitle from './TreeNodeTitle'

const INITIAL_PADDING = 6
const PADDING_WIDTH = 12

export default {
  name: 'TreeNode',
  components: {
    NTitle
  },
  mixins: [mixin],
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    },
    owner: {
      type: String,
      required: true
    }
  },
  computed: {
    isFiltered () {
      return this.tree.filterTypes[this.node.tag]
    },
    padding () {
      return (INITIAL_PADDING + PADDING_WIDTH * this.level) + 'px'
    },
    className () {
      return [
        'sparkl-tree-node',
        {
          'root': this.node.attr.name === this.owner,
          'selected': this.isSelected
        }
      ]
    }
  },
  methods: {
    open () {
      let path = this.node.attr.path || this.owner

      if (this.node.opened) {
        this.$store.commit('TREE_NODE_CLOSE', { path })
      } else {
        this.$store
          .dispatch('fetchTreeBranch', { path })
          .then(() => {
            this.$store.commit('TREE_NODE_OPEN', { path })
          })
      }
    }
  }
}
</script>
<style lang="scss">
.sparkl-tree-node {
  .sparkl-tree-children {
    box-sizing: border-box;
  }

  .selectable {
    border-radius: 2px;
  }

  &.selected {
    & > .tree-title {
      background: #5CA1DF;
      box-shadow: 0 5px 10px 0 rgba(92, 161, 223, 0.4);
      color: white;
      border-radius: 3px;

      input {
        color: #fff;

        &[disabled] {
          color: #fff;
          -webkit-text-fill-color: #fff;
        }
      }

      i {
        background: rgba(92, 161, 223, 0.7);
        color: white !important;
      }
    }
  }

  &.root > .tree-title .icon-open {
    opacity: 1 !important;
  }
}
</style>
