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
  <panel title="Node">
    <div slot="buttons" style="font-size: 12px;">
      <select class="pretty" ref="nodeName" @input="selectNode">
        <option v-for="(n, i) in nodes"
               :value="n"
               :key="i">{{n}}</option>
      </select>
    </div>
    <table class="full-width">
          <tr>
            <td>Node:</td>
            <td>{{sparklNode.node}}</td>
          </tr>
          <tr>
            <td>Core Version:</td>
            <td>{{sparklNode.version}}</td>
          </tr>
          <tr>
            <td>UI Version:</td>
            <td>{{version}}</td>
          </tr>
    </table>
    <div style="padding-top: 10px;">
        <tag v-for="(domain, i) in domainList"
             class="bordered blue"
             style="margin: 0px 5px 5px 0px;"
             :key="i">{{domain}}</tag>
    </div>
    <popover name="nodes" class="dropdown-list">
      <div v-for="(n, i) in nodes"
           :class="{ 'dropdown-list-item': true, 'active': n === sparklNode.node }"
           :key="i"
           @click="selectNode(n)">{{n}}</div>
    </popover>
  </panel>
</template>

<script>
import version from '@/generated/version.json'

export default {
  name: 'Node',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    sparklNode: {
      type: Object,
      required: true
    },
    domains: {
      type: String
    }
  },
  data () {
    return {
      version: version.tag
    }
  },
  computed: {
    domainList () {
      return this.domains.split(' ')
    }
  },
  methods: {
    selectNode (event) {
      this.$nextTick(() => {
        let nodeName = this.$refs.nodeName.value

        this.$emit('select', nodeName)
        this.$notify({
          title: 'Node changed',
          text: `${nodeName} node was selected.`
        })
      })
    }
  }
}
</script>
<style lang="scss">
  .dropdown-list-item {
    padding: 5px;
    text-align: center;
    cursor: pointer;

    &:hover {
      background: #f5f5f5;
    }

    &.active {
      background-color: #5CA1DF;
      border-radius: 3px;
      color: #fff;
    }
  }
</style>
