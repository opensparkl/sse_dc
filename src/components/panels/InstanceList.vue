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
  <panel title="Instances">
    <div class="instance-list"
         v-if="instances.length > 0">
      <div v-for="instance in instances"
           class="instance-list-item"
           :key="instance">
        {{instance}}
      </div>
    </div>
    <div v-else class="empty-label">
      No running instances.
    </div>
    <div slot="buttons">
      <button v-if="isTabserver"
              class="button blue"
              @click="startTabserver">Start Tabserver</button>
      <button class="button green"
              @click="start">Start New Instance</button>
      <button class="button red"
              @click="stopAll">Stop All instances</button>
    </div>
  </panel>
</template>
<script>
import { mapState } from 'vuex'
import api from 'src/api'

export default {
  name: 'SourcePanel',
  computed: {
    ...mapState([
      'tree',
      'node',
      'user'
    ]),
    instances () {
      let { node } = this

      if (node) {
        let instances = node.attr.instances || ''
        return instances.split(' ').filter(v => v)
      }

      return []
    },
    isTabserver () {
      if (this.node) {
        return this.node.attr.provision === 'tabserver_connection'
      }
    }
  },
  methods: {
    reportInstanceStartError (error) {
      let data = error.response.data
      let reason = data.attr.reason

      this.$notify({
        type: 'error',
        duration: 600000,
        title: 'Service error',
        text: `Failed to create a new service instance.<br>The reason is "${reason}".`
      })

      console.warn(error)
    },
    reportInstanceStopError (error) {
      this.$notify({
        type: 'error',
        duration: 600000,
        title: 'Service error',
        text: 'Failed to stop service instance.'
      })

      console.warn(error)
    },
    updateNode () {
      let path = this.node.attr.path

      return this.$store
        .dispatch('fetchTreeBranch', { path })
        .then(() => {
          /* Todo: Clean this up */
          this.$store.dispatch('fetchTreeNode', { path })
          /* Returning promise */
          return this.$store.dispatch('fetchSelectedTreeNode')
        })
    },
    startTabserver () {
      let url = config.get('router.url') + '/tabserver'
      window.open(url, 'tabserver')
    },
    start () {
      let { name, id } = this.node.attr

      api.service.start(id)
        .then(response => {
          this.updateNode()
            .then(() => {
              this.$store.commit('TREE_NODE_OPEN', {
                path: this.node.attr.path
              })
            })
          this.$notify({
            type: 'success',
            title: 'Service started',
            text: `New instance of <b>${name}<b> has just been created.`
          })
        })
        .catch(this.reportInstanceStartError)
    },
    stopAll () {
      api.service.stop(this.node.attr.id)
        .then(response => {
          let count = this.instances.length

          this
            .updateNode()
            .then(() => {
              this.$nextTick(() => {
                count -= this.instances.length

                this.$notify({
                  type: 'success',
                  title: 'Service stopped',
                  text: `${count} service instance(s) stopped.`
                })
              })
            })
        })
        .catch(this.reportInstanceStopError)
    }
  }
}
</script>
