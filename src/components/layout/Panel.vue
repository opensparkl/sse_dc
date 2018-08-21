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

  Basic panel with title and content slot.
-->
<template>
  <div class="panel">
    <div class="panel-content">
      <div v-if="title"
           class="panel-header">
        <div class="panel-title">
          {{title}}
        </div>
        <div class="panel-buttons">
          <slot name="buttons"/>
        </div>
      </div>
      <div :style="contentStyle">
        <slot/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Panel',
  props: ['title'],
  computed: {
    contentStyle () {
      return {
        'padding': this.title ? '10px' : ''
      }
    }
  }
}
</script>
<style lang="scss">
  .panel {
    box-sizing: border-box;
    padding: 10px;
    padding-bottom: 0;
    width: auto;
    max-width: 100%;

    .panel-header {
      display: flex;
      padding: 10px;

      .panel-title {
        flex: 1 0 auto;
        font-weight: 600;
        letter-spacing: 1px;
        color: #8898A5;
        line-height: 18px;
      }

      .panel-buttons {
        flex: 0 1 auto;
        line-height: 18px;
      }
    }

    .panel-content {
      box-sizing: border-box;
      background: white;
      border-radius: 3px;
      border: 1px solid #eaeefb;
      //  box-shadow: 0 0 10px 0 rgba(232, 237, 250, 0.6),
      //      0 2px 10px 0 rgba(232, 237, 250, 0.5)
      box-shadow: 0 0 4px 0 rgba(232, 237, 250, 0.6),
        0 2px 4px 0 rgba(232, 237, 250, 0.5);
    }
  }

  .flex-box {
    & > .panel {
      padding-left: 0;

      &:first-child {
        padding-left: 10px;
      }
    }
  }
</style>
