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
  <single-view class="services-route">
    <panel title="Services">
        <table v-if="services.length > 0" class="table awesome-table">
           <colgroup>
              <col style="width: 140px;">
              <col style="width: 20%;">
              <col style="width: 15%;">
              <col style="">
              <col style="width: 30px;">
          </colgroup>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Provision</th>
              <th colspan="2">
                <div style="display: flex;">
                  <div style="flex: 1 0 auto;">Path</div>
                  <div style="flex: 0 1 auto;">
                    <template v-if="selectedCount > 0">
                      <button class="button red rounded"
                              @click="stopSelectedServices">
                        STOP <b>{{selectedCount}}</b> SERVICES
                      </button>
                      <button class="button green rounded"
                              @click="cancelSelection">CANCEL</button>
                    </template>
                    <template v-else>
                      <button class="button red rounded"
                              @click="stopAllServices">STOP ALL</button>
                    </template>
                  </div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="service in services"
                :class="{selected: service.selected}"
                :key="service.attr.id">
              <td>{{service.attr.id}}</td>
              <td>{{service.attr.name}}</td>
              <td>{{service.attr.provision}}</td>
              <td style="word-break: all;">{{service.attr.path}}</td>
              <td style="text-align: right; width: 80px; max-width: 80px;">
                <input type="checkbox" v-model="service.selected">
              </td>
            </tr>
          </tbody>
        </table>
        <div class="empty-label" v-else>
          No running services.
        </div>
    </panel>
  </single-view>
</template>
<script>
import api from '@/api'
import SingleView from '../layout/SingleView'
import Panel from '../layout/Panel'

export default {
  name: 'ServicesRoute',
  components: {
    SingleView,
    Panel
  },
  data () {
    return {
      services: []
    }
  },
  created () {
    this.getActiveServiceList()
    window.addEventListener('focus', this.getActiveServiceList)
  },
  beforeDestroy () {
    window.removeEventListener('focus', this.getActiveServiceList)
  },
  methods: {
    getActiveServiceList () {
      api.service.list('')
        .then(services => {
          this.services = services.map(s => {
            return { ...s, selected: false }
          })
        })
        .catch(error => {
          console.warn(error)

          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Service error',
            text: 'Failed to retrieve a list of active services'
          })
        })
    },

    cancelSelection () {
      this.services = this.services.map(v => {
        return {...v, selected: false}
      })
    },

    stopService (id) {
      return api.service.stop(id)
        .then(response => {
          this.services = this.services
            .filter(v => v.attr.id !== id)
        })
        .catch(error => {
          console.warn(error)

          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Service error',
            text: 'Failed to stop a service.'
          })
        })
    },

    stopSelectedServices () {
      let promises = this.services
        .filter(service => service.selected)
        .map(service => {
          return this.stopService(service.attr.id)
        })

      Promise.all(promises).catch(error => {
        console.warn(error)
      })
    },

    stopAllServices () {
      this.services.forEach(service => {
        this.stopService(service.attr.id)
      })
    }
  },
  computed: {
    selectedCount () {
      return this.services.filter(v => v.selected).length
    }
  }
}
</script>
<style lang="scss">
  .awesome-table {
    b {
      font-weight: 900;
    }

    .button {
      font-size: 10px;
      padding: 3px 6px;
    }
  }
</style>
