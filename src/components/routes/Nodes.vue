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

  Nodes page.
  Contains "extensions", "node" and "logs" panels.
-->
<template>
  <div class="nodes-route" v-if="info">
    <flex-box :size="3" class="node-info-panels">
      <panel-node :sparkl-node="node"
                  :domains="info.attr.domains"
                  :nodes="nodes"
                  @select="selectNode"/>
      <panel-logs :sparkl-node="node"/>
    </flex-box>
    <panel title="Extensions">
        <table class="table node-info-table">
          <thead>
            <tr>
              <th style="width: 30px;"></th>
              <th>Name</th>
              <th>Description</th>
              <th>Version</th>
              <th style="width: 60px;">Status</th>
            </tr>
          </thead>
          <tr v-for="(e, key) in extensions"
              :key="key"
              class="clickable"
              @click="infoExtension(key)">
            <td>
              <icon name="fa-info-circle" color="#5CA1DF"/>
            </td>
            <td>{{key}}</td>
            <td>{{e.attr.description}}</td>
            <td>{{e.attr.version}}</td>
            <td @click.stop>
              <toggle-button
                v-model="e.attr.running"
                :color="{unchecked: '#EE5332'}"
                :labels="{checked: 'ON', unchecked: 'OFF'}"
                :sync="true"
                @change="toggleExtension(key, $event)"/>
            </td>
          </tr>
        </table>
    </panel>
  </div>
</template>
<script>
import api from '@/api'
import PanelNode from '../panels/Node'
import PanelLogs from '../panels/Logs'

export default {
  name: 'NodesRoute',
  components: {
    PanelNode,
    PanelLogs
  },
  data () {
    return {
      node: null,
      nodes: null,
      info: null,
      extensions: {}
    }
  },
  mounted () {
    api.ping().then(response => {
      this.selectNode(response.data.attr.node)
    })
  },
  methods: {
    selectNode (nodeName) {
      api.info(nodeName).then(json => {
        this.node = json.node
        this.nodes = json.nodes
        this.info = json.data

        this.extensions = json.data.content
          .reduce((obj, item) => {
            obj[item.tag] = item

            return obj
          }, {})
      })
    },
    toggleExtension (extName, event) {
      let { value } = event
      let actionName = value ? 'start' : 'stop'

      api.extension[actionName](this.node.node, extName)
        .then(response => {
          this.updateExtStatus(extName, value)
        })
        .catch(() => {
          this.updateExtStatus(extName, false)
        })
    },

    infoExtension (extName) {
      api.extension.info(this.node.node, extName)
        .then(response => {
          this.$modal.show('info-modal', {
            title: 'Extension details',
            data: response.data
          })
        })
        .catch(error => {
          console.warn(error)
        })
    },

    updateExtStatus (extName, status) {
      this.extensions[extName].attr.running = status
    }
  }
}
</script>
<style lang="scss">
@import "~styles/colors";

.node-info-panels {
  @media screen and (max-width: 780px) {
    padding: 5px;
    flex-wrap: wrap;

    & .panel {
      padding: 5px !important;

      &:first-child {
        flex: 1 0 100%;
      }
    }
  }
}

.nodes-route {
  .panel-content {
    min-height: 162px;
  }

  .nodes-list {
    ul {
      list-style: none;

      li {
        padding: 5px;
        border-radius: 3px;
        overflow: hidden;
        cursor: pointer;
        text-overflow: ellipsis;

        &.active {
          background: #8FA3AC;
          color: white;
        }
      }
    }
  }

  .fa-exclamation-circle, .color-amber {
    color: $amber;
  }

  .fa-check-circle, .fa-check-circle-o, .color-green {
    color: $green;
  }

  .fa-times-circle, .fa-times-circle-o, .color-red {
    color: $red;
  }

  .text-bold {
    font-weight: 600;
  }

  .fa-info-circle {
    text-shadow: 0 2px 10px rgba(92, 161, 223, 0.3);
  }
}
</style>
