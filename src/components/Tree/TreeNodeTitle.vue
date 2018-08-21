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

  TreeView node content element. Contains a sliding menu on the right.
-->
<template>
  <div class="tree-title"
       @click="select">
    <div class="tree-title-content"
         :style="{'padding-left': padding}">
      <i
         :class="plusIcon"
         :style="plusIconStyle"
         @click.stop="open"/>
      <span class="center-text selectable">
        <icon v-if="isService"
              :name="icon"
              :style="serviceIconStyle"/>
        <icon v-else
              :name="icon"/>
        <input type="text"
               :disabled="!isEditingTitle"
               :value="name"
               ref="title"
               class="editable-title-input"
               @keyup="onTitleKeyUp"
               @click.stop>
      </span>
      <div v-if="isSelected && isContainer && node.tag !== 'service'"
           class="micro-menu"
           :class="{ opened: isMenuOpen }"
           @click.stop>
        <i :class="menuIcon"
           @click.stop="toggle"/>
        <icon name="fa-plus"
              v-if="rules.add"
              @click.stop="createFolder"/>
        <icon name="fa-pencil"
              v-if="rules.rename"
              @click.stop="openInEditor"/>
        <icon name="fa-trash"
              v-if="rules.remove"
              @click.stop="remove"/>
      </div>
    </div>
  </div>
</template>
<script>
  import mixin from './mixin'
  import messages from './messages'
  import api from 'src/api'
  import path from 'path'

  export default {
    name: 'TreeNodeTitle',
    props: ['node', 'isOpened', 'padding'],
    mixins: [mixin],
    data () {
      return {
        isMenuOpen: false,
        isEditingTitle: false
      }
    },
    computed: {
      rules () {
        return {
          add: true,
          rename: true,
          remove: true
        }
      },

      plusIcon () {
        return [
          'fa fa-fw icon-open',
          this.isOpened &&
          (this.content.length > 0 || this.serviceHasInstances)
              ? 'fa-minus-square-o'
              : 'fa-plus-square-o'
        ]
      },

      plusIconStyle () {
        return {
          opacity: this.empty ? 0.3 : 1,
          visibility: this.isContainer ? 'visible' : 'hidden'
        }
      },

      menuIcon () {
        return [
          'fa fa-fw icon-menu',
          {
            'fa-remove': this.isMenuOpen,
            'fa-check': !this.isMenuOpen && this.isEditingTitle,
            'fa-navicon': !this.isMenuOpen && !this.isEditingTitle
          }
        ]
      },

      serviceHasInstances () {
        return this.node.attr.instances || ''
      },

      serviceIconStyle () {
        return {
          color: this.serviceHasInstances
            ? '#02ccba'
            : ''
        }
      },

      empty () {
        return !this.node.attr.entries && !this.node.attr.instances
      },

      icon () {
        return config.get('icons')[this.node.tag] || 'fa-question'
      }
    },
    watch: {
      isSelected (value) {
        if (!value) {
          this.isMenuOpen = false
          this.isEditingTitle = false
        }
      }
    },
    methods: {
      toggle () {
        if (this.isEditingTitle) {
          this.isEditingTitle = false
        } else {
          this.isMenuOpen = !this.isMenuOpen
        }
      },

      createFolder () {
        this.$modal.show('create-folder-modal')
      },

      openInEditor () {
        var payload = {
          host: config.get('router.url'),
          folder: this.node.attr.path
        }

        localStorage['sparkl:redirect'] = JSON.stringify(payload)
        window.open('/sse_dc_editor', payload.folder)
      },

      onTitleKeyUp (event) {
        if (event.which === 13) {
          this.toggle()
        }
      },

      startTitleEdit () {
        this.isEditingTitle = true
        this.isMenuOpen = false

        this.$nextTick(() => {
          this.$refs.title.focus()
          this.$refs.title.value = this.$refs.title.value
        })
      },

      open (event) {
        this.$emit('open', event)

        if (this.isSelected === false) {
          this.isMenuOpen = false
        }
      },

      select (event) {
        this.$store.commit('SELECT_TREE_NODE_ID', this.node.attr.id)
        this.$store.dispatch('fetchSelectedTreeNode')
      },

      remove (event) {
        let folderName = this.node.attr.name
        let folderPath = this.node.attr.path

        api.service.list(folderPath).then(services => {
          let serviceIds = services.map(v => v.attr.id)
          let serviceNames = services.map(v => v.attr.name).join(', ')
          let length = serviceIds.length

          let dialogTitle = 'Delete'
          let dialogText = messages
            .removeFolderMessage(folderName, length, serviceNames)

          let buttonLabel = length === 0
            ? 'Delete'
            : 'Stop and delete'

          this.$modal.show('dialog', {
            title: dialogTitle,
            text: dialogText,
            labels: [
              'Cancel',
              buttonLabel
            ],
            handler: function (button) {
              if (button === 1) {
                api.service.stopAll(serviceIds).then(() => {
                  if (length > 0) {
                    this.$notify({
                      type: 'warn',
                      title: dialogTitle,
                      text: `Stopped ${length} services (${serviceNames}) and removed the folder.`
                    })
                  }

                  let parentPath = path.join(folderPath, '../')
                  let parentId = this.node.attr.parent

                  api.source.update(parentId, '', folderName)
                    .then(response => {
                      this.$store.commit('SELECT_TREE_NODE_ID', parentId)
                      this.$store.dispatch('fetchSelectedTreeNode').then(() => {
                        this.$store.dispatch('fetchTreeNode', {
                          path: parentPath
                        })
                        this.$store.dispatch('fetchTreeBranch', {
                          path: parentPath
                        })
                        this.$modal.hide('rtnm')
                      })
                    })
                })
              }

              this.$modal.hide('dialog')
            }.bind(this)
          })
        })
      }
    }
  }
</script>
<style lang="scss">
$buttonCount: 4;
$buttonSize: 24px;

.tree-title {
  position: relative;
  line-height: $buttonSize;
  height: $buttonSize;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  cursor: pointer;

  i {
    user-select: none;
  }

  span, i {
    line-height: $buttonSize;
  }

  .tree-title-content {
    width: 100%;
    overflow: hidden;
    border-radius: 3px;
  }

  .editable-title-input {
    border: 0px;
    padding: 0px;
    margin: 0px;
    box-shadow: none;
    line-height: 24px;
    font-family: inherit;
    font-size: inherit;
    background: transparent;
    color: inherit;

    &[disabled] {
      pointer-events: none;
      color: #474747;
      -webkit-text-fill-color: #474747;
    }
  }

  .instance-count {
    font-size: 8px;
    border: 1px solid white;
    border-radius: 3px;
    padding: 0 4px;
  }

  .micro-menu {
    position: absolute;
    overflow: hidden;
    transition: all 0.4s;
    background: transparent;
    white-space: nowrap;
    border-radius: 3px;
    width: #{$buttonCount * $buttonSize};
    right: -#{($buttonCount - 1) * $buttonSize};
    top: 0;
    color: rgba(255, 255, 255, 0.9);
    border-radius: 10px;

    .icon-menu {
      transition: transform 0.3s;
    }

    &.opened {
      right: 0;

      .icon-menu {
        transform: rotate(90deg);
      }
    }

    i {
      display: inline-block;
      float: left;
      width: $buttonSize;
      text-align: center;
      font-size: 10px;

      &:hover {
        color: white;
      }
    }
  }
}
</style>
