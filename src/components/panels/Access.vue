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
  <panel title="Access Rights"
         v-if="grants.length > 0">
    <table class="table">
      <thead>
        <tr>
          <th>To</th>
          <th>Permission</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(grant, i) in grants"
            :key="i">
          <td>{{grant.attr.to}}</td>
          <td>
            <tag v-for="term in grant.access"
                 style="margin-right: 4px;"
                 :key="term">{{term}}</tag>
          </td>
        </tr>
      </tbody>
    </table>
  </panel>
</template>
<script>
import { mapState } from 'vuex'

const terms = {
  'r': 'read',
  'w': 'write',
  'x': 'execute'
}

export default {
  name: 'AccessPanel',
  computed: {
    ...mapState([
      'node'
    ]),
    grants () {
      let { node, map } = this

      if (node && node.content) {
        return node.content
          .filter(v => v.tag === 'grant')
          .map(map)
      }

      return []
    }
  },
  methods: {
    map (grant) {
      let access = grant.attr.permission
        .split('')
        .map(letter => terms[letter])

      return { ...grant, access }
    }
  }
}
</script>
