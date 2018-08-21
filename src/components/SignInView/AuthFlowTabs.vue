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
-->
<template>
  <div class="authflow-tab-list">
    <div v-for="(option, i) in authFlows"
         :class="{ 'authflow-tab': true, 'active': option.id === authFlow }"
         :key="option.id"
         @click="select(option.id)">
      {{option.title}}
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { flows } from './constants'

export default {
  name: 'SignTabs',
  computed: {
    ...mapState([
      'authFlow',
      'authFlowOptions'
    ]),

    authFlows () {
      return this.authFlowOptions.map(v => {
        return {
          id: v,
          title: flows[v].title
        }
      })
    }
  },
  methods: {
    select (id) {
      this.$store.commit('SET_AUTH_FLOW', id)
    }
  }
}
</script>

<style lang="scss">
.authflow-tab-list {
  display: flex;
  background: #F8F9FA;

  .authflow-tab {
    text-align: center;
    flex: 1;

    padding: 15px;

    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 10px;
    font-weight: 600;

    cursor: pointer;

    &:not(.active) {
      border-bottom: 1px solid #DBE2E8;
      color: #999;
    }

    &.active {
      background-color: #fff;

      &:not(:last-child) {
        border-right: 1px solid #DBE2E8;
      }

      &:not(:first-child) {
        border-left: 1px solid #DBE2E8;
      }


      border-top-left-radius: 5px;
      border-top-right-radius: 5px;
    }

  }
}
</style>
