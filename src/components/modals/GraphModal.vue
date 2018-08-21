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

  Generates the Sequencing Graph from all operations of a mix.
-->
<template>
  <modal class="graph-modal"
         name="graph"
         :adaptive="true"
         :resizable="true"
         :width="1000"
         draggable=".graph-modal-header"
         :height="450"
         @before-open="beforeOpen">
    <div class="graph-modal-header" style="display: flex;">
      <button class="button-a small" @click="zoomIn">
        <i class="fa fa-fw fa-search-plus"/>
      </button>
      <button class="button-a small" @click="zoomOut">
        <i class="fa fa-fw fa-search-minus"/>
      </button>
    </div>
    <div class="graph-modal-content">
      <div id="graph-info"/>
      <div id="graph-canvas"/>
    </div>
  </modal>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'
import Graph from '@/util/graph'
import Type from '@/util/type'

export default {
  name: 'GraphModal',
  data () {
    return {
      id: null,
      graph: null
    }
  },
  computed: {
    ...mapState([
      'tree'
    ])
  },
  methods: {
    beforeOpen (event) {
      this.id = event.params.id
      this.renderGraph()
    },
    zoomIn () {
      this.graph.zoomIn()
    },
    zoomOut () {
      this.graph.zoomOut()
    },
    fullscreen () {

    },
    renderGraph () {
      api.graph(this.id).then(graphResponse => {
        api.mix(this.tree.selected).then(mixResponse => {
          let graphData = graphResponse.data
          let json = mixResponse.data

          json.attr.externs = json.attr.externs
            ? json.attr.externs.split(' ')
            : []

          var operations = []

          json.nodes = json.content
            .reduce(function (nodes, node) {
              node.type = Type.getType(node.tag)

              if (node.type === 'mix') {
                node.type = 'folder'
              }

              if (node.type === 'operation' && node.attr.service) {
                operations.push(node)
              }

              nodes[node.attr.id] = node
              return nodes
            }, {})

          operations.forEach(function (operation) {
            var index = operation.attr.service
            var service = json.nodes[index]

            operation.serviceName = service.attr.name
          })

          this.graph = new Graph('#graph-canvas', graphData, json)
        })
      })
    }
  }
}
</script>
<style lang="scss">
$green: #1ab394;
$red: #E2574C;
$yellow: #DBA226;

.graph-modal {
  .graph-modal-content {
    position: relative;

    #graph-info {
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  svg {
    border: 1px solid #eee;
    user-select: none;

    .text-blob {
      pointer-events: none;
    }
  }

  rect {
    fill: none;
    pointer-events: all;
  }

  .topology-node {
    cursor: pointer;

    &.simple.default {
      .svg-circle {
        stroke: $green;
        fill: white;
      }
    }

    &.segment {
      .svg-circle {
        stroke: #94B9CC;
      }

      &.fixed > .svg-circle {
        fill: #94B9CC;
      }
    }

    &.asset {
      .svg-circle {
        stroke: $red;
      }

      &.fixed > .svg-circle {
        fill: $red;
      }
    }
  }

  .topology-link {
    .t-link-line {
      stroke-width: 2px;
      stroke: $green;
    }
  }

  .svg-circle {
    fill: white;
    stroke: grey;
    stroke-width: 2px;
  }

  .svg-link-circle {
    stroke-width: 0;
    fill: $green;
  }

  .svg-segment-line {
    stroke-width: 2px;
    stroke: #94B9CC;
  }

  .svg-line {
    fill: none;
    stroke: #666;
    stroke-width: 1px;
  }

  .interface-text {
    transition: opacity .3s;
  }

  .svg-text {
    pointer-events: none;
    font-size: 12px;
    font-family: inherit;

    paint-order: stroke;
    stroke: white;
    stroke-width: 2px;
    stroke-linecap: butt;
    stroke-linejoin: miter;
    fill: #737373;
  }

  .dark-text {
    fill: #222;
  }

  .transparent {
    opacity: 0;
  }

  .graph-link {
    z-index: 1;

    path {
      stroke: rgba($green, 0.8);
      stroke-width: 2px;

      &.highlight {
        stroke-width: 5px;
      }
    }
  }

  .graph-node {
    cursor: pointer;
    z-index: 1;

    circle {
      fill: white;
      stroke: $green;
      stroke-width: 2px;
      transition: stroke .3s;
    }

    text {
      &:not(.fields-list) {
        stroke-width: 0;
        fill: $green;
      }

      &.fields-list {
        opacity: 0;
      }
    }
  }

  .graph-selected {
    z-index: 999;

    circle {
      stroke: $red;
    }

    text.fields-list {
      opacity: 1;
      fill: #333;
    }

    text:not(.fields-list) {
      //fill: white;
      fill: $red;
      stroke-width: 0px;
    }
  }

  .graph-target {
    z-index: 999;
    path {
      stroke: $yellow;
    }
  }

  .graph-source {
    z-index: 999;

    path {
      stroke: blue;
    }
  }

  .svg-label {
    // @include transition();
    opacity: 0;

    text {
      stroke-width: 4px;
    }

    &.visible {
      opacity: 1;
    }
  }

  .dragging .graph-node:not(.graph-selected) circle {
    stroke: mix($green, white, 50%) !important;
  }

  .d3-tip {
    z-index: 9999;
    font-size: 12px;
    border: 4px solid $green;
    background-color: $green;
    color: white;
    margin-bottom: 10px;
    min-width: 40px;
    text-align: center;
    border-radius: 2px;
    transition: opacity .2s;

    .d3-arrow {
      position: absolute;
      width: 0;
      height: 0;
      top: 100%;
      border: solid transparent;
      left: 50%;
      margin-left: -10px;
      border-width: 10px 10px 0;
      border-top-color: $green;
    }
  }
}

.sequencing {
  position: relative;

  .seq-op-top, .seq-op-bot, .seq-fields {
    position: absolute;
    pointer-events: none;
    max-width: calc(100% - 10px);
    z-index: 10;
    top: 10px;

    .sb-node {
      display: block;
    }
  }

  .seq-op-top {
    left: 5px;
  }

  .seq-op-bot {
    right: 5px;
  }
}
</style>
