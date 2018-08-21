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

  Component is responsible for rendering various types of operations
  on the mix panel.
-->
<template>
  <div :class="nodeClass"
       :id="id">
    <table class="operation-table">
      <tr class="s-node-header"
          v-for="(subject, i) in subjects"
          :class="[subject.tag, 'droppable']"
          :key="subject.attr.id"
          :id="subject.attr.id">
        <td :class="{'s-node-title': true}"
            @mousedown.left.stop="select(subject.attr.id)"
            @mouseenter="mouseover"
            @mouseleave="mouseleave">
          <div class="s-n-name-field">
            <div class="title-top">{{subject.attr.name}}</div>
            <div class="title-bottom">{{subject.attr.service}}</div>
          </div>

          <template v-if="subject.tag === 'solicit' || subject.tag === 'notify'">
            <div class="graph-btn"
                 @mousedown.left.stop.prevent="showGraph">
              <i class="fa fa-fw fa-sitemap"/>
            </div>
          </template>
        </td>
        <td class="s-node-fields">
          <field v-for="fieldId in subject.attr.fields"
                 :parent="subject"
                 :node="nodes[fieldId]"/>
        </td>
      </tr>
    </table>
  </div>
</template>
<script>
  import Type from '@/util/type'
  import Field from './Field'
  import node from './mixins/node'

  export default {
    name: 'Operation',
    mixins: [node],
    components: {
      Field
    },
    methods: {
      showGraph () {
        this.$modal.show('graph', {
          id: this.node.attr.id
        })
      }
    },
    computed: {
      subjects () {
        return [this.node].concat(this.replies)
      },

      replies () {
        return (this.node.content || [])
          .map(this.getNodeById)
          .filter(node => Type.is(node, 'operation'))
      },
      fields () {
        let { attr } = this.node

        if (attr.fields) {
          return attr.fields.map(this.getNodeById)
        }

        return []
      },

      isExtendable () {
        return Type.isExtendable(this.node)
      }
    }
  }
</script>
<style lang="scss">
.graph-btn {
  display: inline-block;
  vertical-align: middle;
  line-height: 1;
  cursor: pointer;
}
</style>
