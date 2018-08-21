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

  Modal window that shows information about extensions at /nodes
-->
<template>
  <modal name="info-modal"
         transition="slide"
         :width="500"
         height="auto"
         :pivot-y="0.25"
         :resizable="true"
         :adaptive="true"
         :scrollable="true"
         :reset="true"
         @before-open="beforeOpen">
    <div v-if="title"
         class="info-modal-title">
      {{title}}
    </div>
    <div class="info-modal-content">
      <template v-if="text"
                v-html="text"/>
      <template v-if="data">
        <json-text :data="data"/>
      </template>
    </div>
  </modal>
</template>
<script>
import JsonText from '@/components/elements/JsonText'

export default {
  name: 'InfoModal',
  components: {
    JsonText
  },
  data () {
    return {
      title: '',
      text: '',
      data: null
    }
  },
  methods: {
    beforeOpen (event) {
      let params = event.params

      this.title = params.title ? params.title : ''
      this.data = params.data || params.text || ''
    }
  }
}
</script>
<style lang="scss">
.info-modal-title {
  padding: 10px;
  font-weight: 600;
}

.info-modal-content {
  padding: 10px;
  overflow: scroll !important;
  height: 100%;
  word-break: break-word;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s;
}

.slide-enter,
.slide-leave-active {
  opacity: 0;
  transform: translateY(24px);
}
</style>
