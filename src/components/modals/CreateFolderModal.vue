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

  Dialog window for creating folders/mixes in the configuration tree.
-->
<template>
  <modal name="create-folder-modal"
         classes="v--modal vue-dialog"
         :width="400"
         :height="180"
         :pivot-y="0.3"
         :adaptive="true"
         transition="fade">
    <flex-box direction="column" class="dialog-flex">
      <div class="dialog-content">
        <div class="dialog-c-title">
          Create
        </div>
        <div class="dialog-c-text">
          <div>
            <div style="border-bottom: 1px solid #eee;">
              <select class="pretty"
                      style="width: 80px; display: inline;"
                      v-model="type">
                <option value="folder">Folder</option>
                <option value="mix">Mix</option>
              </select>
              <input v-model="name"
                     ref="name"
                     style="margin: 0; padding: 0; line-height: 32px; border: 0;"
                     placeholder="Name">
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-buttons">
        <button style="width: 50%" @click="cancel">
          Cancel
        </button>
        <button style="width: 50%" @click="create">
          Create
        </button>
      </div>
    </flex-box>
  </modal>
</template>
<script>
import { mapState } from 'vuex'
import api from 'src/api'

export default {
  name: 'CreateFolderModal',
  data () {
    return {
      type: 'folder',
      name: ''
    }
  },
  computed: {
    ...mapState([
      'node',
      'tree',
      'user'
    ])
  },
  methods: {
    clean () {
      this.type = 'folder'
      this.name = ''
      this.$modal.hide('create-folder-modal')
    },
    cancel () {
      this.clean()
    },
    create () {
      let { type, name } = this
      let folder = `<${type} name="${name}"/>`
      let path = this.node.attr.path ||
        (this.user.name + '/')

      if (!name) {
        this.$notify({
          type: 'error',
          duration: 600000,
          title: 'Error',
          text: 'Folder name must not be blank'
        })

        return
      }

      api.source.update(path, folder)
        .then(response => {
          this.$store.dispatch('fetchTreeNode', { path })
          this.$store.dispatch('fetchTreeBranch', { path })

          this.$modal.hide('create-folder-modal')
        })
        .catch(error => {
          let data = error.response.data
          let text = ''

          try {
            let reason = data.attr.reason
            text = `Failed to create a ${type}, reason: ${reason}`
          } catch (error) {
            text = JSON.stringify(data)
          }

          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Error',
            text
          })
        })

      this.clean()
    }
  }
}
</script>
<style>
.link-grey {
  font-size: 12px;
  color: #999;
}
</style>
