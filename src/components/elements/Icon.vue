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

  Generic icon component
-->
<template>
  <i :class="className"
     :style="style"
     @click="$emit('click', $event)"></i>
</template>
<script>
  export default {
    name: 'Icon',
    props: {
      name: {
        type: String,
        default: ''
      },
      button: {
        type: Boolean,
        default: false
      },
      color: {
        type: String,
        default: ''
      }
    },
    computed: {
      className () {
        let { name, button } = this

        return [
          {
            'fa fa-fw': name.indexOf('fa') === 0,
            'icon': name.indexOf('ion') === 0,
            'icon-is-button': button
          },
          name
        ]
      },
      style () {
        return {
          color: this.color
        }
      }
    }
  }
</script>
<style>
.icon-is-button {
  cursor: pointer;
}
</style>
