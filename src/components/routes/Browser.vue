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

  Browser page.
  This is the main page which contains TreeView element.
-->
<template>
  <split-view class="browser-route">
    <div slot="left">
      <panel class="tree-view-panel">
        <div class="tree-view-panel-content">
          <div style="display: flex; padding: 5px 0 10px;">
            <input type="file"
                   ref="upload"
                   style="display: none;"
                   accept="application/xml"
                   multiple
                   @change="uploadFiles">

            <button class="button-a small"
                    @click="undoChange">
              <icon name="fa-undo"/>
            </button>

            <button class="button-a small"
                    @click="openImportDialog">
              <icon name="fa-upload"/>
            </button>

            <button class="button-a small beep"
                    v-popover:filter.bottom>
              <icon name="fa-filter" :class="{ applied: filtersApplied }"/>
            </button>

            <button class="button-a small"
                    v-popover:open.bottom>
              <icon name="fa-bullseye"/>
            </button>

            <transition name="fade">
              <popover name="filter">
                <button v-for="filter in filters"
                        :class="['button', tree.filterTypes[filter] ? 'green' : 'red']"
                        style="margin: 2px; min-width: 80px;"
                        @click="$store.commit('TOGGLE_FILTER', filter)">
                  <span>
                    {{tree.filterTypes[filter] ? '+' : '-'}}
                  </span>
                  {{filter}}
                </button>
              </popover>
            </transition>

            <transition name="fade">
              <popover name="open"
                       :width="300">
                <input placeholder="Node path or ID"
                       v-model="localPathSearch"
                       style="width: 240px">
                <button class="button green"
                        @click="openPath">Open</button>
              </popover>
            </transition>
          </div>
          <tree/>
        </div>
      </panel>
    </div>
    <div slot="right" style="height: 100vh; overflow: auto;">
      <flex-box v-if="node" :size="1" wrap="wrap" style="padding-bottom: 10px;">
        <panel style="display: none;"/>
        <component v-for="panelName in panelList"
                   :node="node"
                   :key="panelName"
                   :is="panelName"/>
      </flex-box>
    </div>
  </split-view>
</template>
<script>
  import _ from 'lodash'
  import api from 'src/api'
  import { mapState } from 'vuex'
  import Tree from '../Tree'
  import PanelMix from '../panels/Mix'
  import PanelService from '../panels/Service'
  import PanelSource from '../panels/Source'
  import PanelInstance from '../panels/Instance'
  import PanelInstanceList from '../panels/InstanceList'
  import PanelAccess from '../panels/Access'
  import PanelOperation from '../panels/Operation'
  import SplitView from '../layout/SplitView'
  import Panel from '../layout/Panel'
  import Type from '@/util/type'
  import { isContainer, isRenderable } from 'src/util/type'

  export default {
    name: 'BrowserRoute',
    components: {
      PanelMix,
      PanelAccess,
      PanelSource,
      PanelService,
      PanelInstance,
      PanelOperation,
      PanelInstanceList,
      SplitView,
      Panel,
      Tree
    },
    computed: {
      ...mapState([
        'sessionId',
        'tree',
        'node',
        'user'
      ]),
      filtersApplied () {
        return this.filters
          .map(v => this.tree.filterTypes[v])
          .filter(v => v === true)
          .length > 0
      },
      type () {
        return this.node
          ? Type.getType(this.node.tag)
          : ''
      },
      panelList () {
        let { node } = this

        if (!node) {
          return []
        }

        if (node.tag === 'instance') {
          return ['panel-instance']
        }

        let type = Type.getType(node)
        let list = []

        switch (type) {
          case 'operation':
            list.push('panel-operation')
            break
          case 'container':
            list.push('panel-access')

            if (node.tag === 'mix') {
              list.push('panel-mix')
            }

            break
          case 'service':
            list.push('panel-service', 'panel-instance-list')
            break
        }

        return list.concat('panel-source')
      }
    },
    data () {
      return {
        filters: ['field', 'service'],
        localPathSearch: ''
      }
    },
    created () {
      window.addEventListener('focus', this.windowFocus, false)
      window.addEventListener('blur', this.windowBlur, false)
    },
    beforeDestroy () {
      window.removeEventListener('focus', this.windowFocus)
      window.removeEventListener('blur', this.windowBlur)
    },
    methods: {
      undoChange () {
        api.deleteChange()
          .then(this.refreshTree)
          .catch(error => {
            this.$notify({
              type: 'error',
              duration: 600000,
              title: 'Error',
              text: JSON.stringify(error.response.data.attr)
            })
          })
      },
      openPath () {
        api.object(this.localPathSearch)
          .then(response => {
            let node = response.data
            let path = node.attr.path

            if (path) {
              // console.log('Opening path:', path)
              this.openByPath(path)
            }
          })
          .catch(error => {
            console.warn(error)

            this.$notify({
              type: 'error',
              duration: 600000,
              title: 'Error',
              text: 'Requested node does not exist'
            })
          })
      },
      openImportDialog () {
        if (this.tree.selected) {
          this.$refs.upload.value = ''
          this.$refs.upload.click()
        } else {
          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Import failed',
            text: 'Please select a folder where you want to import new configuration file.'
          })
        }
      },
      uploadFile (file) {
        let { selected } = this.tree
        let target = selected === this.user.id
          ? ''
          : selected
        let formdata = new FormData()

        formdata.append('file', file)

        api.source.upload(target, formdata)
          .then(response => {
            let path = this.node.attr.path || (this.user.name + '/')

            this.$notify({
              type: 'success',
              title: 'Uploading finished.',
              text: `${file.name} was saved to ${path}`
            })

            this.$store.dispatch('fetchTreeNode', { path })
            this.$store.dispatch('fetchTreeBranch', { path })
          })
          .catch(error => {
            let response = error.response
            let reason = ''

            try {
              reason = response.data.attr.reason
            } catch (exception) {
              console.warn(exception)
              reason = 'server_error'
            }

            this.$notify({
              type: 'error',
              duration: 600000,
              title: 'Uploading error.',
              text: `Failed to upload ${file.name}, reason: ${reason}.`
            })
          })
      },

      uploadFiles (event) {
        let files = event.target.files

        for (let i = 0; i < files.length; i++) {
          this.uploadFile(files[i])
        }
      },

      traverse (node, callback, parent = null) {
        callback(node, parent)

        if (node.content) {
          for (var i = 0; i < node.content.length; i++) {
            this.traverse(node.content[i], callback, node)
          }
        }
      },

      fetchOpenFolder ({ path, opened }, callback) {
        this.$store.dispatch('fetchTreeBranch', { path })
          .then(payload => {
            if (opened) {
              this.$store.commit('TREE_NODE_OPEN', { path })
            }
            callback(payload)
          })
      },

      synchronize (renderedTree, path) {
        if (renderedTree.hasOwnProperty(path)) {
          let { opened } = renderedTree[path]
          let folder = { path, opened }

          this.fetchOpenFolder(folder, ({ content }) => {
            content
              .filter(v => isContainer(v.tag))
              .forEach(v => {
                this.synchronize(renderedTree, v.attr.path)
              })
//            let date = new Date().toLocaleDateString()
//            console.log(date + ': Refreshed ' + path)
          })
        }
      },

      windowFocus () {
        this.$title('Developer Console')
        this.refreshTree()
      },

      refreshTree () {
        let root = this.tree.roots[this.user.name]
        let mapping = []

        this.traverse(root, (node, parent, next) => {
          if (typeof node !== 'string') {
            if (isContainer(node.tag) && node.content) {
              let content = node.content
                .filter(v => isRenderable(v.tag))

              if (content.length !== 0) {
                let path = node.attr.path

                mapping[path] = {
                  opened: node.opened,
                  content: []
                }

                if (parent) {
                  let parentPath = parent.attr.path
                  mapping[parentPath].content.push(path)
                }
              }
            }
          }
        })

        this.synchronize(mapping, this.user.name + '/')
      },

      openByPath (path) {
        let chunks = path.split('/').filter(v => v)

        let prev = ''
        let paths = chunks.map(chunk => {
          prev += chunk + '/'
          return prev
        })

        let open = (index, callback) => {
          let folder = { path: paths[index], opened: true }

          this.fetchOpenFolder(folder, (payload) => {
            index++

            if (index < (paths.length - 1)) {
              open(index, callback)
            } else {
              callback(payload)
            }
          })
        }

        open(0, (data) => {
          let focusNodePath = paths[paths.length - 1]

          this.$store
            .dispatch('fetchTreeNode', { path: focusNodePath })
            .then(data => {
              let { node } = data
              this.$store.commit('SELECT_TREE_NODE_ID', node.attr.id)
            })
        })
      },

      windowBlur () {
        let { node } = this

        if (node) {
          let type = _.capitalize(node.tag)
          let name = node.attr.name || node.attr.id || ''

          this.$title(type + ': ' + name)
        }
      }
    }
  }
</script>
<style lang="scss">
  .tree-view-panel > .panel-content > div {
    height: calc(100vh - 20px);

    .tree-view-panel-content {
      height: 100%;
      overflow: auto;
      padding: 5px;

      .button-a:hover {
        background: rgba(136, 152, 165, 0.08);
      }
    }
  }

  .fa-filter.applied::after {
    display: block;
    position: absolute;

    right: 3px;
    top: 3px;
    content: ' ';
    background: #75C791;
    width: 6px;
    height: 6px;
    border-radius: 50%;
  }

  .browser-route {
    align-items: stretch;

    & > .split-left {
      overflow-y: auto;
      overflow-x: auto;

      .split-left-content {
        height: 100vh;
      }
    }
  }
</style>
