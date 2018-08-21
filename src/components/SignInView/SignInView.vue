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
  <div class="sign-window">
    <logo/>
    <div class="sign-box">
      <div class="sign-box-content" style="padding-top: 0;">
        <div style="display: flex; flex-direction: row; padding: 0px 20px 15px 20px;">
          <input type="text"
                 placeholder="SPARKL URL"
                 class="sign-input router-url"
                 style="border-bottom: 0"
                 v-model="routerURL"
                 @input="inputRouterURL">
          <div style="margin-top: 25px;">
            <i v-if="ping === 'success'"
               class="fa fa-fw fa-check"
               style="color: #02CCBA"/>
            <i v-if="ping === 'error'"
               class="fa fa-fw fa-remove"
               style="color: #DC544B"/>
            <i v-if="ping === 'waiting'"
               class="fa fa-fw fa-spinner fa-pulse"
               style="color: #999"/>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade-reverse">
      <div class="sign-box"
           v-if="ping === 'success'"
           style="margin-top: 10px">
        <div class="sign-box-content"
             :class="{ extended: message }"
             :style="style">
          <!-- Autocomplete fix -->
          <input name="email"
                 type="text"
                 style="display: none;">
          <input name="password"
                 type="password"
                 style="display: none;">

          <div>
            <transition name="component-fade" mode="out-in">
              <component :is="view"
                         :params="viewParams"
                         @action="onAction"/>
            </transition>
          </div>
        </div>
        <div class="sign-box-footer">
          <transition name="fade-reverse">
            <div v-if="message"
                 :class="{ 'sign-box-extra': true, 'has-error': messageType === 'error' }"
                 @click="cleanMessage">
              {{message}}
            </div>
          </transition>

          <template v-if="view === 'SignUp'">
            <a href="#"
               @click.stop="setView('SignVerify')">Verify registration</a>
            · Have an account?
            <a href="#"
               @click.stop="setView('SignIn')">Sign In</a>
          </template>
          <template v-else-if="view === 'SignForgot'">
            <a href="#"
               @click.stop="setView('SignIn')">Sign In</a>
            · Don't have an account?
            <a href="#"
               @click.stop="setView('SignUp')">Sign Up</a>
          </template>
          <template v-else>
            <a href="#"
               @click.stop="setView('SignForgot')">Forgot password</a>?
            · Don't have an account?
            <a href="#"
               @click.stop="setView('SignUp')">Sign Up</a>
          </template>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
  import api from 'src/api'
  import Logo from './Logo'
  import SignIn from './SignIn'
  import SignUp from './SignUp'
  import SignForgot from './SignForgot'
  import SignVerify from './SignVerify'
  import SignReset from './SignReset'
  import { sizes } from './constants'
  import methods from './methods'
  import _ from 'lodash'

  export default {
    name: 'SignInView',
    components: {
      Logo,
      SignIn,
      SignUp,
      SignReset,
      SignVerify,
      SignForgot
    },
    mixins: [methods],
    data () {
      return {
        ping: 'waiting',
        routerURL: config.get('router.url'),

        message: null,
        messageType: 'error',
        messageTimer: null,

        view: 'SignIn',
        viewParams: {}
      }
    },
    computed: {
      style () {
        return {
          height: sizes[this.view] + 'px'
        }
      }
    },
    mounted () {
      if (this.routerURL === '') {
        this.routerURL = window.location.origin
      }
      this.updateInputRouterURL()
    },
    methods: {
      updateInputRouterURL: _.debounce(function () {
        config.set('router.url', this.routerURL)
        api.setBaseUrl(this.routerURL)

        api.ping()
          .then(response => {
            let data = response.data
            let flows = data.attr.auth_flows.split(' ')

            this.$store.commit('SET_AUTH_FLOW_OPTIONS', flows)
            this.$store.commit('SET_AUTH_FLOW', flows[0])

            this.$nextTick(() => {
              this.ping = 'success'
            })
          })
          .catch(() => {
            this.ping = 'error'
          })
      }, 500),

      inputRouterURL (event) {
        this.ping = 'waiting'
        this.updateInputRouterURL()
      },

      cleanMessage () {
        if (this.messageTimer) {
          clearTimeout(this.messageTimer)
          this.messageTimer = null
        }

        this.message = ''
      },

      showMessage (type, text) {
        this.message = text
        this.messageType = type
        this.messageTimer = setTimeout(this.cleanMessage, 3000)
      },

      setView (viewName, params = {}) {
        this.cleanMessage()

        this.viewParams = params
        this.view = viewName
      },

      onAction (action) {
        this.cleanMessage()

        if (action.error) {
          this.showMessage('error', action.error)
        }

        if (action.message) {
          this.$nextTick(() => {
            this.showMessage('success', action.message)
          })
        }

        if (action.view) {
          this.setView(action.view, action.params)
        }
      }
    }
  }
</script>
<style lang="scss">
  @import "~styles/colors";

  .sign-dialog-content {
    padding: 0px 20px 20px 20px;
  }

  .sign-window {
    width: 100vw;
    height: 100vh;
    padding-top: 100px;
    background: rgb(72, 188, 220);
    &, div {
      box-sizing: border-box;
    }

    .sign-box {
      max-width: 500px;
      margin: 0 auto;
      padding: 5px;
      font-size: 16px;

      .sign-box-title {
        text-align: center;
        letter-spacing: 1px;
        font-size: 32px;
      }

      .sign-box-content {
        position: relative;
        overflow: hidden;
        /*padding: 20px;*/
        width: 100%;
        background: #ffffff;
        color: #585858;
        border: 0;
        border-radius: 5px;
        box-shadow: 0px 5px 25px 0px rgba(46, 61, 73, 0.3);
        transition: all 0.3s;

        z-index: 10;

        &.extended {
          border-bottom-right-radius: 0;
          border-bottom-left-radius: 0;
        }

        img {
          width: 64px;
        }
      }

      .sign-box-footer {
        position: relative;
        width: 100%;
        padding-top: 32px;
        color: white;
        text-align: center;
        font-size: 14px;

        a {
          color: inherit;
        }
      }

      .sign-box-extra {
        position: absolute;
        top: 0;
        width: 100%;
        background: mix(#02ccba, #ffffff, 15%);
        color: #02ccba;

        box-shadow: 0px 5px 25px 0px rgba(46, 61, 73, 0.3);

        border-radius: 5px;
        border-top-right-radius: 0;
        border-top-left-radius: 0;

        padding: 20px 15px;

        &.has-error {
          background: #F2DEDE;
          color: #BB4945;
        }
      }
    }

    button {
      padding: 12px;
      box-shadow: none;
      background: #02ccba;
      font-weight: 600;
      width: 100%;
      box-shadow: 0 5px 15px 0px rgba(46,61,73,0.2);

      &:hover {
        background: mix(#02ccba, white, 90%);
      }

      &:active {
        background: mix(#02ccba, black, 90%);
      }
    }
  }

  .sign-input {
    height: 44px;
    box-sizing: border-box;
    padding-left: 15px;
    padding-right: 15px;
    border: 0;
    font-size: 14px;
    color: #2e3d49;
    width: 100%;

  //  &.bordered {
      border-bottom: 1px solid #dbe2e8;

      &:focus {
        border-bottom-color: #02CCBA;
      }
  //  }

    margin-bottom: 0;
    margin-top: 14px;
  }

  .absolute {
    position: absolute;
  }

  .uppercase {
    text-transform: uppercase;
    letter-spacing: 1px;
  }
</style>
