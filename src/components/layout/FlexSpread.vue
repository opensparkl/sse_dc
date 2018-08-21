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

  Layout component that stretches to 100% width. Comprises two child nodes
  on its left and right, with space between them.
-->
<template>
  <div class="flex-spread" :style="style">
    <div class="flex-spread-left">
      <slot name="left"/>
    </div>
    <div class="flex-spread-right">
      <slot name="right"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FlexSpread',
  props: {
    direction: {
      type: String
    }
  },
  computed: {
    style () {
      return {
        'flex-direction': this.direction
      }
    }
  }
}
</script>
<style lang="scss">
.flex-spread {
  display: flex;
  flex-direction: row;

  .flex-spread-left {
    flex: 1 0 auto;
  }

  .flex-spread-right {
    flex: 0 1 auto;
  }
}
</style>
