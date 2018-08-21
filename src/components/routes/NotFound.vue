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

  This page will be rendered if opened route does not exist
  (for example when the link is broken).
-->
<template>
  <div class="not-found">
    <div class="is-404">404</div>
    <div>Not found :(</div>
  </div>
</template>
<script>
  export default {
    name: 'NotFoundRoute'
  }
</script>
<style lang="scss">
  .not-found {
    height: 100vh;
    width: 100vw;
    background: #F1F1F1;
    text-align: center;

    font-size: 32px;
    font-weight: 300;

    text-transform: uppercase;
    letter-spacing: 2px;

    .is-404 {
      font-size: 200px;
      padding-top: 100px;
    }
  }
</style>
