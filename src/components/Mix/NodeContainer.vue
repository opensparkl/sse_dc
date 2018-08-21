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

  Component is responsible for rendering mixes & folders on the mix panel.
-->
<template>
  <div :class="containerClass"
       :id="id"
       :key="id"
       @mousedown="isRoot && select()">
    <div class="s-node-background"/>
    <div class="s-node-header"
         @mouseenter="mouseover"
         @mouseleave="mouseleave">
      <div class="s-node-title">
        <div class="s-n-name-field">
          <i :class="['fa fa-fw fa-sort-desc', folded && 'fa-rotate-270']"
             @mousedown.stop="folded = !folded"/>
          <i :class="icon"/>
          <span>{{node.attr.name}}</span>
        </div>
      </div>
    </div>

    <div v-if="!folded"
         class="s-node-content"
         @mousedown.stop="unselect">
      <div class="centered-container owns-service">
        <basic v-for="v in groups.service"
               :id="v.attr.id"
               :nodes="nodes"
               :key="v.attr.id"/>
      </div>
      <div class="centered-container owns-field">
        <basic v-for="v in groups.field"
               :id="v.attr.id"
               :nodes="nodes"
               :key="v.attr.id"/>
      </div>
      <div class="owns-operation">
        <operation v-for="v in groups.operation"
                   :id="v.attr.id"
                   :nodes="nodes"
                   :key="v.attr.id"/>
      </div>
      <container v-for="v in groups.container"
                 :id="v.attr.id"
                 :nodes="nodes"
                 :key="v.attr.id"/>
    </div>
  </div>
</template>
<script>
  import Type from '@/util/type'
  import Operation from './NodeOperation'
  import Basic from './NodeBasic'
  import node from './mixins/node'

  export default {
    name: 'Container',
    mixins: [node],
    components: { Operation, Basic },
    props: ['isRoot'],
    data: function () {
      return {
        folded: false
      }
    },
    computed: {
      containerClass () {
        return [
          this.nodeClass,
          'droppable'
        ]
      },
      groups () {
        var content = this.node.content
        var groups = {}

        for (var i = 0; i < content.length; i++) {
          var id = content[i]
          var node = this.nodes[id]

          if (Type.isRenderable(node.tag)) {
            var type = Type.getType(node)

            if (!groups[type]) {
              groups[type] = []
            }

            groups[type].push(node)
          }
        }

        return groups
      }
    }
  }
</script>
