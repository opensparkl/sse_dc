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

  Modal window for generating authentication tokens.
-->
<template>
  <modal name="auth-token-dialog"
         classes="v--modal vue-dialog"
         :width="400"
         height="auto"
         :pivot-y="0.3"
         :adaptive="true"
         transition="fade"
         @before-close="beforeClose">
    <flex-box direction="column"
              class="dialog-flex">
      <div class="dialog-content">
        <div class="dialog-c-title">Authentication Token</div>
        <div class="dialog-c-text">
          <div>
            <div>
              Token name:
            </div>
            <div>
              <input placeholder="my_great_token_name"
                     v-model="name"
                     class="unit-test-input"
                     @input="input">
            </div>
          </div>

          <div v-if="secret">
            <div class="important-note"
                 style="padding-top: 20px;">
              <b>IMPORTANT!</b>
              <br>
              Make sure to copy your new personal secret token now.
              You won’t be able to see it again!
            </div>
            <div style="padding-top: 20px;">
              <div>
                Token secret:
              </div>
              <div style="position: relative;">
                <input :value="secret"
                       disabled
                       class="unit-test-input"
                       id="secret-token-val">
                <button class="copy-secret-btn"
                        v-clipboard="secret">
                  <i class="fa fa-fw fa-clipboard"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="dialog-buttons">
        <button style="flex: 1 1 50%"
                @click="hide">
          Cancel
        </button>
        <button style="flex: 1 1 50%" @click="generate">
          {{generateLabel}}
        </button>
      </div>
    </flex-box>
  </modal>
</template>
<script>
import { mapState } from 'vuex'
import api from '@/api'

export default {
  name: 'AuthTokenDialog',
  data () {
    return {
      name: '',
      secret: '',
      generated: false
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),

    generateLabel () {
      return this.generated
        ? 'Re-generate'
        : 'Generate'
    }
  },
  methods: {
    hide () {
      this.$modal.hide('auth-token-dialog')
    },

    beforeClose () {
      this.generated = false
      this.secret = ''
      this.name = ''
    },

    generate (event) {
      this.createToken()
    },

    input () {
      if (this.generated) {
        this.generated = false
      }
    },

    createToken () {
      let userName = this.user.name
      let tokenName = this.name

      if (!tokenName) {
        return this.$notify({
          type: 'error',
          duration: 600000,
          title: 'Token generation failed',
          text: 'Token name is empty'
        })
      }

      api.user.setValue(userName, 'token', tokenName)
        .then(response => {
          let data = response.data
          let secret = data.attr.secret
          let token = data.attr.token

          this.secret = secret
          this.generated = true
          this.$emit('generate')

          this.$notify({
            type: 'warn',
            title: 'Token generation',
            text: `Successfully generated <b>${token}</b> authentication token`
          })
        })
        .catch(error => {
          let data = error.response.data
          let reason = data.attr.reason

          this.$notify({
            type: 'error',
            duration: 600000,
            title: 'Token generation failed',
            text: `Reason: ${reason}`
          })
        })
    }
  }
}
</script>
<style lang="scss">
@import "~styles/colors";

.important-note {
  color: $red;
}

#secret-input-val {
  letter-spacing: 1px;
}

.modal-input-button {
  line-height: 24px !important;
  height: 24px !important;
  width: 28px;
  text-align: center;
  border: 0;
  padding: 0;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: mix(transparent, black, 98%);
  }

  &:active {
    background: mix(transparent, black, 94%);
  }
}

.copy-secret-btn {
  right: 0;
  top: 5px;
  position: absolute;
  line-height: 24px;
  border: 0;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: mix(transparent, black, 98%);
  }

  &:active {
    background: mix(transparent, black, 94%);
  }
}
</style>
