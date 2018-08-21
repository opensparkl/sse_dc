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
  <div class="sign-dialog-content">
    <input type="text"
           class="sign-input"
           placeholder="Email Address"
           v-model="username"
           @keyup.enter="verify">
     <input type="text"
            class="sign-input"
            placeholder="Verification Code"
            v-model="code"
            @keyup.enter="verify">
    <div style="padding-top: 20px;">
      <button class="button uppercase"
              @click="verify">Confirm Registration</button>
    </div>
    <div style="padding-top: 10px;">
      <button class="button uppercase"
              @click="resend">Resend code</button>
    </div>
  </div>
</template>
<script>
import cognito from '@/api/cognito'
import validator from './validator'
import messages from './messages'

export default {
  name: 'SignForgot',
  mixins: [validator],
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      username: this.params.username || '',
      code: ''
    }
  },
  methods: {
    verify () {
      let { username, code } = this

      cognito.confirm(username, code, (err, data) => {
        let payload = err
          ? { error: err.message }
          : { view: 'SignIn', message: messages.verificationSuccess }

        this.$emit('action', payload)
      })
    },

    resend () {
      let { username, validateEmail } = this
      let error = validateEmail(username || '')

      if (error) {
        return this.$emit('action', { error })
      }

      cognito.resend(username, (err, data) => {
        let event = err
          ? { error: err.message }
          : { message: messages.verificationResend }

        this.$emit('action', event)
      })
    }
  }
}
</script>
