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

  SignIn page SPARKL logo
-->
<template>
  <div class="logo">
    <img src="static/images/logo_xz.svg"> <span>SPARKL</span>
  </div>
</template>
<script>
export default {
  name: 'Logo'
}
</script>
<style lang="scss">
  .logo {
    margin: 10px 0;
    text-align: center;
    color: white;

    img {
      vertical-align: middle;
      width: 40px;

      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
    }

    span {
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
      font-size: 24px;
      font-weight: 600;

      filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
    }
  }
</style>
