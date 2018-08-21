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
              @keyup.enter="signup">
      <input type="password"
              class="sign-input"
              placeholder="Password"
              v-model="password1"
              @keyup.enter="signup">
      <input type="password"
              class="sign-input"
              placeholder="Repeat Password"
              v-model="password2"
              @keyup.enter="signup">
      <div style="padding-top: 20px;">
        <button class="button uppercase" @click="signup">
          Create account
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import cognito from '@/api/cognito'
import api from '@/api'
import validator from './validator'
import { mapState } from 'vuex'
import methods from './methods'
import messages from './messages'
import AuthFlowTabs from './AuthFlowTabs'

export default {
  name: 'SignUp',
  mixins: [validator, methods],
  data () {
    return {
      username: '',
      password1: '',
      password2: ''
    }
  },
  components: {
    AuthFlowTabs
  },
  computed: {
    ...mapState([
      'authFlow'
    ])
  },
  methods: {
    signupCognito () {
      let { username, password1 } = this
      cognito.signup(username, password1, (err, data) => {
        if (err) {
          this.$emit('action', { error: err.message })
          return
        }

        this.$emit('action', {
          view: 'SignVerify',
          message: messages.signinCode,
          params: { username }
        })
      })
    },
    signupLocally () {
      api.user.create(this.username, this.password1)
        .then(response => {
          this.$store.commit('SET_USER', response.data.attr)
          this.$router.push({ path: '/browser' })
        })
        .catch(error => {
          this.$emit('action', {
            error: this.getSparklErrorMessage(error.response, 'Registration')
          })
        })
    },
    signup () {
      let { authFlow, username, password1, password2, validateEmail } = this
      let error = validateEmail(username)

      if (error) {
        this.$emit('action', { error })
        return
      }

      if (password1 !== password2) {
        this.$emit('action', {
          error: messages.passwordsMatchError
        })
        return
      }

      switch (authFlow) {
        case 'sparkl':
          this.signupLocally()
          break
        case 'cognito':
          this.signupCognito()
          break
        default:
          break
      }
    }
  }
}
</script>
