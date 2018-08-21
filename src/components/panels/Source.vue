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
  <panel v-if="html"
         title="Source"
         class="source-panel">
    <div slot="buttons"
         style="font-size: 11px; color: #8898A5;">
      {{this.node.attr.id}}
    </div>

    <div style="display: flex; padding-bottom: 10px;">
      <button class="button-a small align-left"
              @click="download">
        <i class="fa fa-download" />
      </button>
      <button class="button-a small align-left"
              @click="getPath">
        <i class="fa fa-search" />
      </button>
      <button class="button-a small align-left"
              :class="{ blue: isShowAll }"
              @click="expandAll">
        <i class="fa fa-expand"/>
      </button>
      <template v-if="isContainer">
        <button class="button-a small align-left"
                @click="openInEditor">
          <i class="fa fa-pencil" />
        </button>
      </template>
    </div>
    <div :class="{ 'code-view': true, 'show-all': isShowAll }"
         v-html="html">
    </div>
  </panel>
</template>

<script>
import api from '@/api'
import type from '@/util/type'
import xslt from '@/util/xslt'
import parser from '@/util/parser'
import { download } from '@/util'

xslt.use({
  'to_html': './static/xsl/xml2html.xsl'
})

export default {
  name: 'SourcePanel',
  props: {
    node: {
      type: Object
    }
  },
  data () {
    return {
      isShowAll: false,
      source: '',
      html: ''
    }
  },
  watch: {
    'node': {
      handler: function (node) {
        if (node.attr.id === this.$store.getters.treeRoot.attr.id) {
          this.source = ''
          return
        }

        let { id } = node.attr

        api.source.get(id, 'application/xml')
          .then(response => {
            this.source = response.data

            xslt.transform('to_html', this.source, (xml) => {
              this.html = parser.xml2String(xml) || ''

              this.$nextTick(() => {
                let nodelist = document.querySelectorAll('.element')
                let array = Array.from(nodelist)

                array.forEach(element => {
                  element.addEventListener('click', (event) => {
                    let left = event.target.getBoundingClientRect().left

                    if (left - event.clientX >= -15) {
                      element.classList.toggle('open')
                    }

                    event.cancelBubble = true
                    event.stopPropagation()
                  })
                })
              })
            })
          })
          .catch(error => {
            console.warn(error)
          })
      },
      immediate: true
    }
  },
  computed: {
    isContainer () {
      if (this.node) {
        return type.isContainer(this.node)
      }
    }
  },
  methods: {
    expandAll () {
      this.isShowAll = !this.isShowAll
    },

    getPath () {
      let resource_path = this.node.attr.path
      this.$clipboard(resource_path)

      return this.$notify({
          type: 'success',
          title: 'Copied resource path to clipboard.',
        })
    },

    download () {
      download(this.source, this.node.attr.name, 'xml')
    },

    openInEditor () {
      let payload = {
        host: config.get('router.url'),
        folder: this.node.attr.path
      }

      localStorage['sparkl:redirect'] = JSON.stringify(payload)
      window.open('/sse_dc_editor', payload.folder)
    }
  }
}
</script>
<style lang="scss">
@import "~styles/colors";

.source-panel {
  width: 0;

  .panel-header {
    padding-bottom: 0;
  }
}

.code-view {
  position: relative;
  cursor: default;
  line-height: 1.5;
  overflow-x: auto;
  box-sizing: border-box;
  border-radius: 5px;
  padding: 10px;
  font-weight: 500;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  & > .element .element:not(.empty) {
    &:before {
      display: block;
      position: absolute;
      font-family: "FontAwesome";
      cursor: pointer;
      color: #8898A5;
      left: 15px;
      width: 20px;
      content: "\f0da";
      user-select: none;
      transition: 300ms all;
    }

    &.open:before {
      content: "\f0d7";
    }

    .element, .text {
      display: none;
    }
  }

  .element {
    font-family: "Source Code Pro", monospace;
    font-size: 13px;
    color: #444;

    .element {
      padding-left: 16px;
    }

    .text {
      white-space: pre;
    }

    .open-tag, .close-tag {
      color:  #2795EE;
    }

    .attribute {
      display: inline;

      .name {
        color: #a151d2;
      }

      .value {
        color: #249D7F;
      }
    }
  }

  .element.open {
    & > .element, & > .text {
      display: block !important;
    }
  }

  &.show-all {
    .element, .text {
      display: block !important;
    }

    .element:before {
      opacity: .0;
      pointer-events: none;
    }
  }
}
</style>
