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
  <div>
    <auth-flow-tabs/>
    <div class="sign-dialog-content">
      <input type="text"
             class="sign-input"
             placeholder="Email Address"
             v-model="username"
             @keyup.enter="signin">
      <input type="password"
             class="sign-input"
             placeholder="Password"
             v-model="password"
             @keyup.enter="signin">
      <div style="padding-top: 20px;">
        <button class="button uppercase" @click="signin">Sign In</button>
      </div>
    </div>
  </div>
</template>
<script>
import cognito from '@/api/cognito'
import api from '@/api'
import validator from './validator'
import methods from './methods'
import { mapState } from 'vuex'

import AuthFlowTabs from './AuthFlowTabs'

export default {
  name: 'SignIn',
  props: {
    params: {
      type: Object
    }
  },
  components: {
    AuthFlowTabs
  },
  data () {
    return {
      username: this.params.username || '',
      password: ''
    }
  },
  mixins: [validator, methods],
  computed: {
    ...mapState([
      'authFlow'
    ])
  },
  methods: {
    signin () {
      /* Locally validate email address */
      let error = this.validateEmail(this.username)

      if (error) {
        this.$emit('action', { error })
        return
      }

      switch (this.authFlow) {
        case 'sparkl':
          this.signinLocally()
          break
        case 'cognito':
          this.signinCognito()
          break
        default:
          alert('Auth flow is not set')
          break
      }
    },

    signinLocally () {
      api.authenticate(this.username, this.password)
        .then(response => {
          this.$store.commit('SET_USER', response.data.attr)
          this.$router.push({path: '/browser'})
        })
        .catch(error => {
          let res = error.response

          this.$emit('action', {
            error: this.getSparklErrorMessage(res, 'Authentication')
          })
        })
    },

    signinCognito () {
      cognito.full_login(this.username, this.password, (err, data) => {
        if (err) {
          /*
            Account is not verified
          */
          if (err.code === 'UserNotConfirmedException') {
            this.$emit('action', {
              view: 'SignVerify',
              error: err.message,
              params: { username: this.username }
            })
            return
          }
          /*
            Sparkl error
          */
          if (err.data && err.data.tag) {
            let error = this.getSparklErrorMessage(err, 'Authentication')
            this.$emit('action', { error })
            return
          }

          /*
            Cognito error
          */
          this.$emit('action', { error: err.message })
          return
        }

        this.$router.push({ path: '/browser' })
      })
    }
  }
}
</script>
