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

  Wraps content into .tag class.
-->
<template>
  <span
    class="tag"
    :style="style"><slot/></span>
</template>
<script>
  export default {
    name: 'Tag',
    props: {
      color: {
        type: String
      }
    },
    computed: {
      style () {
        return {
          'background-color': this.color || ''
        }
      }
    }
  }
</script>
<style lang="scss">
.tag {
  display: inline-block;

  font-size: 10px;
  font-weight: 600;

  color: #F9FAFC;
  background: #8898A5;

  padding: 3px 6px;
  border-radius: 3px;

  &.blue {
    border: 0;
    background: '#5CA1DF';
    color: #fff;
  }

  &.bordered {
    border: 1px solid #8898A5;
    background: transparent;
    color: #8898A5;

    &.blue {
      border: 1px solid rgb(92, 161, 223);
      background: transparent;
      color: rgb(92, 161, 223);
    }
  }
}
</style>
