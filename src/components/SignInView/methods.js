/**
 * Copyright 2018 SPARKL Limited
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import api from '@/api'

export default {
  methods: {
    getConnection (callback) {
      window.$serializedTree = null
      this.$store.commit('CLEAN')

      api.ping()
        .then(response => {
          let authFlow = this.getAuthFromFromResponse(response)
          callback(authFlow, response)
        })
        .catch((e) => {
          let error = this.getConnectionErrorMessage()
          this.$emit('action', { error })
        })
    },
    getAuthFromFromResponse (res) {
      let configAuthFlow = config.get('authFlow')
      let attr = res.data.attr
      let flows = attr.auth_flows.split(' ').filter(v => v)
      let flow = flows.indexOf(configAuthFlow) === -1
        ? flows[0]
        : configAuthFlow

      if (configAuthFlow !== flow) {
        console.warn(`"${configAuthFlow}" auth flow is not availiable, using "${flow}".`)
      }

      return flow
    },

    getConnectionErrorMessage () {
      let routerURL = config.get('router.url')
      return `Failed to establish connection to the server (${routerURL}).`
    },

    getSparklErrorMessage (response, operation = 'Operation') {
      let reason = response.data.attr.reason

      return `${operation} failed. Reason: ${reason}.`
    }
  }
}
