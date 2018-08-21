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
  <panel title="Logs">
      <div style="margin-bottom: 5px;">
        <select class="pretty" v-model="logType">
          <option value="all">All</option>
          <option value="error">Error</option>
          <option value="crash_report">Crash Report</option>
          <option value="error_report">Error Report</option>
          <option value="info_msg">Info Message</option>
          <option value="info_report">Info Report</option>
          <option value="progress">Progress</option>
          <option value="supervisor_report">Supervisor Report</option>
          <option value="warning_msg">Warning Message</option>
          <option value="warning_report">Warning Report</option>
        </select>
      </div>
      <button class="button medium"
              style="float:right"
              @click="open">Open logs</button>
  </panel>
</template>
<script>
  import { mapState } from 'vuex'

  export default {
    name: 'Logs',
    props: {
      sparklNode: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        root: config.get('router.url'),
        logType: 'all'
      }
    },
    computed: {
      ...mapState([
        'node'
      ]),
      url () {
        let { sparklNode, root, logType } = this
        let node = sparklNode.node
        return `${root}/sse_log/log?node=${node}&type=${logType}`
      }
    },
    methods: {
      open () {
        window.open(this.url, 'logs')
      }
    }
  }
</script>
