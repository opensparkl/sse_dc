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

  User management page.
-->
<template>
  <single-view class="users-route">
    <auth-token-dialog @generate="getAuthTokens"/>

    <panel title="Account">
      <div slot="buttons">
        <button class="button red" @click="logout"><i class="fa fa-sign-out"></i> Log out</button>
      </div>
      <div style="padding-bottom: 10px;">
        <div style="display: flex; flex-direction: row;">
          <div style="flex: 0 0 94px; padding-left: 10px;">
            <img class="avatar"
                 :src="'https://www.gravatar.com/avatar/' + emailHash + '?d=identicon&s=64'">
          </div>
          <div style="flex: 1 0 auto; display: flex; flex-direction: column;">
            <div style="padding-bottom: 10px; flex: 1 0 auto;">
              <div>
                <b>{{user.name}}</b>
                <tag v-if="user.administrator" color="#EE5332">ADMIN</tag>
              </div>
              <div style="font-size: 10px;">{{user.id}}</div>
            </div>
            <div>
              <button class="button" @click="editSelf">
                <i class="fa fa-pencil"></i> Update profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </panel>

    <panel title="Authentication">
      <div slot="buttons">
        <button class="button" @click="openAuthTokenDialog">
          <i class="fa fa-id-card"></i> Generate Access Tokens
        </button>
      </div>
      <div v-if="authTokens.length">
        <h4 style="margin: 10px 0;">Access tokens:</h4>
        <div>
          <div v-for="(token, i) in authTokens"
               class="tag tag-token"
               :key="i">
            <span>{{token.attr.token}}</span>
            <i class="icon ion-close-round"
               style="padding-left: 5px;"
               @click="removeToken(token.attr.token)"></i>
          </div>
        </div>
      </div>
    </panel>

    <panel title="Users" v-if="user.administrator && scopedUserList.length > 0">
      <div slot="buttons" v-if="debug">
        <button class="button" @click="createUser">
          <i class="fa fa-fw fa-user"></i>
          Create user
        </button>
      </div>
      <table class="table awesome-table">
          <colgroup>
            <col style="width: 140px;">
            <col>
            <col>
            <col style="width: 30px;">
          </colgroup>
          <thead>
            <tr>
              <th style="width: 130px;">ID</th>
              <th>Name</th>
              <th colspan="2">
                <flex-spread>
                  <div slot="left">Provider</div>
                  <div slot="right">
                    <template v-if="rowSelectedCount > 0">
                      <button class="button red rounded"
                              @click="removeSelectedUsers">
                        REMOVE <b>{{rowSelectedCount}}</b> USERS
                      </button>
                      <button class="button green rounded"
                              @click="cancelSelection">CANCEL</button>
                    </template>
                  </div>
                </flex-spread>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in scopedUserList"
                :class="['clickable', {selected: u.selected}]"
                :key="u.id"
                @click="showUserInfo(u.id)">
              <td >{{u.id}}</td>
              <td>{{u.name}} <tag v-if="u.administrator" color="#EE5332">ADMIN</tag></td>
              <td>{{u.provider}}</td>
              <td style="width: 60px; text-align: right;" @click.stop>
                <input type="checkbox" v-model="u.selected">
              </td>
            </tr>
          </tbody>
        </table>
    </panel>
  </single-view>
</template>
<script>
  import { mapState } from 'vuex'
  import SingleView from '../layout/SingleView'
  import Panel from '../layout/Panel'
  import api from '@/api'
  import md5 from 'md5'
  import AuthTokenDialog from '../modals/AuthTokenDialog'

  export default {
    name: 'UsersRoute',
    components: {
      SingleView,
      Panel,
      AuthTokenDialog
    },
    data () {
      return {
        scopedUserList: [],
        authTokens: [],
        debug: config.get('debug')
      }
    },
    computed: {
      ...mapState([
        'user',
        'users'
      ]),
      emailHash () {
        return md5(this.user.name.trim())
      },
      rowSelectedCount () {
        return this.scopedUserList.filter(v => v.selected).length
      }
    },
    watch: {
      users (users) {
        this.scopedUserList = (this.users || []).map(v => {
          return { ...v, selected: false }
        })
      }
    },
    created () {
      if (this.user.administrator) {
        this.getAllUsers()
      }
      this.getAuthTokens()
    },
    methods: {
      createUser () {
        let email = Math.random().toString(36).substr(2) + '@sparkl.com'
        let password = Math.random().toString(36).substr(2)

        api.user.create(email, password)
          .then(this.getAllUsers)
          .catch(error => {
            console.log(error.response.data)
          })
      },

      getAllUsers () {
        this.$store.dispatch('fetchUsers')
      },

      getAuthTokens () {
        api.object(this.user.id).then(response => {
          let content = response.data.content

          if (content) {
            this.authTokens = content.filter(v => {
              return v.tag === 'prop' &&
                v.attr.name.indexOf('token') === 0
            })
          } else {
            this.authTokens = []
          }
        })
      },

      removeToken (tokenName) {
        let userName = this.user.name
        api.user
          .setValue(userName, 'token', tokenName, '&delete=true')
          .then(response => {
            this.getAuthTokens()
          })
          .catch(error => {
            console.warn(error)
          })
      },

      removeSelectedUsers () {
        var selected = this.scopedUserList.filter(v => v.selected)
        var promises = selected.map(v => api.user.delete(v.id))

        Promise.all(promises)
          .then(this.getAllUsers)
          .catch(this.getAllUsers)
      },

      editSelf () {
        this.$modal.show('user-info-modal', {
          user: this.user
        })
      },

      showUserInfo (id) {
        let users = this.scopedUserList.filter(v => v.id === id)

        if (users.length > 0) {
          this.$modal.show('user-info-modal', {
            user: users[0]
          })
        }
      },

      cancelSelection () {
        this.scopedUserList = this.scopedUserList
          .map(v => {
            return {...v, selected: false}
          })
      },

      logout () {
        this.$router.push({ path: '/signout' })
      },

      openAuthTokenDialog () {
        this.$modal.show('auth-token-dialog')
      }
    }
  }
</script>
<style lang="scss">
  @import "~styles/index";

  .avatar {
    width: 64px;
    height: 64px;
    line-height: 64px;
    border-radius: 32px;
    text-align: center;

    // bacgkroudn #ff00ff;
    // color: white;

    font-size: 32px;
    font-weight: 600;
  }

  .tag-token {
  //  padding: 0 10px;
    margin: 2px;
    border-radius: 40px;
    padding-left:  8px;
    padding-right: 8px;

    box-shadow: 1px 3px 10px rgba(0, 0, 0, 0.15);

    i {
      cursor: pointer;
    }
  /*
    line-height: 20px;
    height: 20px;
    border-radius: 100px;
    background: #f3f3f3;
    color: #999;
    font-size: 13px;
  */
  }

</style>
