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
  <panel title="Instance">
    <div class="padding-10">
      <json-text :data="json"/>
    </div>
  </panel>
</template>

<script>
import api from 'src/api'
import JsonText from '@/components/elements/JsonText'

export default {
  name: 'SourcePanel',
  components: {
    JsonText
  },
  props: {
    node: {
      type: Object
    }
  },
  data () {
    return {
      json: null
    }
  },
  watch: {
    'node': {
      handler: function (node) {
        this.json = null

        api.source.get(node.attr.id, 'application/json')
          .then(response => {
            this.json = { ...response.data }
          })
          .catch(error => {
            let data = error.response.data
            let reason = data.attr.reason

            this.$notify({
              type: 'error',
              duration: 600000,
              title: 'Service error',
              text: 'Reason: ' + reason
            })
          })
      },
      immediate: true
    }
  }
}
</script>
