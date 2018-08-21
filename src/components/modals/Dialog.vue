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

  Generic dialog window with arbitrary number of buttons.
-->
<template>
  <modal name="dialog"
         classes="v--modal vue-dialog"
         :width="400"
         height="auto"
         :pivot-y="0.3"
         :adaptive="true"
         transition="fade"
         @before-open="beforeOpened"
         @before-close="beforeClosed">
    <flex-box direction="column"
              class="dialog-flex">
      <div class="dialog-content">
        <div class="dialog-c-title"
             v-text="params.title || ''"/>
        <div class="dialog-c-text"
             v-html="params.text || ''"/>
      </div>
      <div class="dialog-buttons">
        <button v-for="(label, i) in labels"
                :style="'flex: 1 1 ' + 100 / labels.length + '%'"
                :key='i'
                @click.stop="click(i, $event)">
          {{label}}
        </button>
      </div>
    </flex-box>
  </modal>
</template>
<script>
  export default {
    name: 'Dialog',
    data () {
      return {
        params: {},
        defaultLabels: ['Cancel', 'Ok']
      }
    },
    computed: {
      labels () {
        return this.params.labels || this.defaultLabels
      }
    },
    methods: {
      beforeOpened (event) {
        this.params = event.params || {}
      },
      beforeClosed () {
        this.params = {}
      },
      click (i, event) {
        let { handler } = this.params

        if (typeof handler === 'function') {
          return handler(i, event)
        }
      }
    }
  }
</script>
<style lang="scss">
  .vue-dialog {
    font-size: 14px;
    color: rgb(100, 114, 118);

    .dialog-flex {
      width: 100%;
      height: 100%;
    }

    .dialog-content {
      flex: 1 0 auto;
      width: 100%;

      .dialog-c-title {
        font-weight: 600;
        padding: 15px;
      }

      .dialog-c-text {
        padding: 0px 15px;
        padding-bottom: 15px;
      }
    }

    .dialog-buttons {
      display: flex;
      flex: 0 1 auto;
      width: 100%;
      border-top: 1px solid #eee;
      font-size: 12px;

      button {
        background: transparent;
        padding: 0;
        margin: 0;
        border: 0;
        cursor: pointer;
        box-sizing: border-box;
        line-height: 44px;
        height: 44px;

        text-transform: uppercase;
        letter-spacing: 1px;

        color:inherit;
        font:inherit;

        &:hover {
          background: mix(black, transparent, 0.8%);
        }

        &:active {
          background: mix(black, transparent, 2.4%);
        }

        &:not(:first-of-type) {
          border-left: 1px solid #eee;
        }
      }
    }
  }
</style>
