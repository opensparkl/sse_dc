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

  Modal for showing user info at /users.
-->
<template>
  <modal name="user-info-modal"
         transition="slide"
         :width="500"
         :height="288"
         :pivot-y="0.3"
         :adaptive="true"
         @before-open="beforeOpen">
    <div v-if="target">
      <div style="padding: 10px; font-weight: 600;">
        User details
      </div>
      <table class="user-info-table">
        <tr>
          <td>
            Email
          </td>
          <td>
            {{target.name}}
          </td>
        </tr>
        <tr v-if="user.administrator">
          <td>
            Administrator
          </td>
          <td>
            <input type="checkbox" v-model="targetIsAdmin">
          </td>
        </tr>
      </table>
      <p style="padding: 5px 10px; padding-bottom: 0; margin: 0;">
        <b>Change password</b>
      </p>

      <div style="padding: 10px;">
        <form autocomplete="off">
          <input id="username"
                 style="display:none"
                 type="text"
                 name="fakeusernameremembered">

          <input id="password"
                 style="display:none"
                 type="password"
                 name="fakepasswordremembered">

          <template v-if="isSelf">
            <input type="password"
                   v-model="password.old"
                   placeholder="Old Password"
                   class="unit-test-input">
          </template>

          <input type="password"
                 v-model="password.new"
                 placeholder="New Password"
                 class="unit-test-input">

          <input type="password"
                 v-model="password.repeat"
                 placeholder="Repeat New Password"
                 class="unit-test-input">
        </form>
      </div>
      <div style="padding: 10px; padding-top: 0;">
        <flex-spread>
          <div slot="left" style="color: red;">
            {{error}}
          </div>
          <div slot="right">
            <button class="button green large" @click="save">Save</button>
          </div>
        </flex-spread>
      </div>
    </div>
  </modal>
</template>
<script>
import api from '@/api'
import { mapState } from 'vuex'

export default {
  name: 'UserInfoModal',
  data () {
    return {
      target: null,
      targetIsAdmin: false,

      error: '',
      password: {
        old: '',
        new: '',
        repeat: ''
      }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    isSelf () {
      try {
        return this.user.id === this.target.id
      } catch (e) {
        return null
      }
    }
  },
  methods: {
    beforeOpen (event) {
      let target = event.params.user

      if (!target) {
        throw new Error('No user was selected for an update.')
      }

      this.target = { ...target }
      this.targetIsAdmin = this.target.administrator
    },

    validatePasswordFields () {
      let password = this.password

      if (password.new.length < 3) {
        return 'New password is too short.'
      }

      if (password.repeat !== password.new) {
        return 'Passwords do not match.'
      }

      return null
    },

    getPasswordPromise () {
      let id = this.target.id
      let password = this.password
      let tail = password.old
        ? ('&old=' + password.old)
        : ''

      return api.user.setPassword(id, this.password.new, tail)
    },

    cleanFields () {
      this.password.old = ''
      this.password.new = ''
      this.password.repeat = ''
    },

    save () {
      let { password, user, target, targetIsAdmin } = this
      let { validatePasswordFields, getPasswordPromise } = this
      let promises = []

      this.error = ''

      if (password.new.length > 0) {
        let error = validatePasswordFields()

        if (error) {
          this.error = error
          return
        }

        promises.push(getPasswordPromise())
      }

      if (user.administrator && target.administrator !== targetIsAdmin) {
        let promise = api.user.setAdmin(target.id, targetIsAdmin)
        promises.push(promise)
      }

      if (promises.length === 0) {
        this.cleanFields()
        this.$modal.hide('user-info-modal')
        return
      }

      Promise.all(promises)
        .then(responses => {
          this.cleanFields()
          this.$store.dispatch('fetchUsers')
          this.$modal.hide('user-info-modal')

          this.$notify({
            type: 'success',
            title: 'User info',
            text: `<b>${target.name}</b> info was successfully updated`
          })
        })
        .catch(error => {
          this.error = error.response.data.attr
        })
    }
  }
}
</script>
<style lang="scss">

input.a {
  border: 0;
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
  font-size: 13px;
  border-bottom: 1px solid #eee;
}

.user-info-table {
  width: 100%;
  padding: 10px;

  td {
    width: 50%;
  }

  // input {
  //  font-size: inherit;
  //  line-height: inherit;
  //  padding: 0;
  // }

  button {
    line-height: 36px;
    padding: 0;
  }
}
</style>
