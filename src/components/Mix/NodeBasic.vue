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

  Component is responsible for rendering services & fields on the mix
  panel.
-->
<template>
  <div :class="nodeClass"
       :id="id"
       :data-type="dataType"
       @mouseenter="mouseover"
       @mouseleave="mouseleave">
    <div class="s-node-header">
      <div :class="titleClass">
        <div class="s-n-name-field">
          <i v-if="icon"
             :class="icon"
             aria-hidden="true"/>
          <span>{{node.attr.name}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import node from './mixins/node'

  export default {
    mixins: [node],
    computed: {
      titleClass () {
        return {
          's-node-title': true
        }
      },
      dataType () {
        return this.type === 'field' && (this.node.attr.type || 'flag')
      }
    }
  }
</script>
<style lang="scss">
  @import "~src/components/Mix/styles/style.scss";
</style>
