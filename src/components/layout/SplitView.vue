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

  Styled page layout with 2 columns.
  First column's width is 300px, the second fills all remaining space.
-->
<template>
  <div class="split-view">
    <div class="split-left">
      <div class="split-left-content">
        <slot name="left"/>
      </div>
    </div>
    <div class="split-right">
      <div class="split-right-content">
        <slot name="right"/>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SplitView'
}
</script>
<style lang="scss">
.split-view {
  display: flex;
  align-items: stretch;

  .split-left {
    flex: 0 0 300px;

    .split-left-content {
      min-height: 100%;
    }
  }

  .split-right {
    flex: 1 1 100%;

    .split-right-content {
      min-height: 100%;
    }
  }
}
</style>
