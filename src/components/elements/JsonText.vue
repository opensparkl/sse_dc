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

  Component recursively renders JSON file.
-->
<template>
  <div v-if="data">
    <div class="rt-title">{{data.tag}}</div>
    <table class="rt-table">
      <tr v-for="(value, key) in data.attr"
          :key="key">
        <td>{{key}}</td>
        <td>{{value}}</td>
      </tr>
    </table>
    <div>
      <json-text
        v-for="(value, key) in data.content"
        :key="key"
        :data="value"/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'JsonText',
  props: ['data'],
  filters: {
    prettify (value) {
      return value.substr(0, 1).toUpperCase() +
        value.substr(1).replace('_', ' ')
    }
  }
}
</script>
<style lang="scss" scoped>
  .rt-title {
    font-weight: 600;
  }

  .rt-table {
    tr {
      td {
        padding: 2px 6px;

        &:first-child {
          white-space: nowrap;
        }
      }
    }
  }
</style>
