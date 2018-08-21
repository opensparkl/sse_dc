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
           @keyup.enter="reset">
    <div style="padding-top: 20px;">
      <button class="button uppercase"
              @click="reset">Send verification email</button>
    </div>
  </div>
</template>
<script>
import cognito from '@/api/cognito'
import messages from './messages'

export default {
  name: 'SignForgot',
  props: {
    params: {
      type: Object
    }
  },
  data () {
    return {
      username: this.params.username || ''
    }
  },
  methods: {
    reset (event) {
      let { username } = this

      cognito.resetPassword(username, (err, data) => {
        let payload = err
          ? { error: err.message }
          : { view: 'SignReset',
            params: { username },
            message: messages.verificationCode }

        this.$emit('action', payload)
      })
    }
  }
}
</script>
