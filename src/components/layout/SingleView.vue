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

  Styled page layout.
-->
<template>
  <div class="single-view">
    <div class="single-view-content">
      <slot/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SinglieView'
}
</script>
<style lang="scss">
.single-view {
  display: block;
  box-sizing: border-box;

  .single-view-content {
    border-radius: 3px;
    min-width: 100%;
    min-height: calc(100vh - 20px);
  }
}
</style>
