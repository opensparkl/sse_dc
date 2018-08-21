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

  Main application navbar.
-->
<template>
  <div class="navbar test">
    <div class="navbar-flex-top">
      <img src="static/images/logo_x1_blue.svg" style="width: 24px;">
    </div>
    <div class="navbar-flex-middle">
      <div style="height: 100px;"/>
      <router-link class="button-a" to="/browser">
        <i class="fa fa-fw fa-desktop" aria-hidden="true"/>
      </router-link>
      <router-link v-if="user.administrator"
                   class="button-a"
                   to="/nodes">
        <i class="fa fa-fw fa-th" aria-hidden="true"/>
      </router-link>
      <router-link class="button-a" to="/services">
        <i class="fa fa-fw fa-cubes" aria-hidden="true"/>
      </router-link>
      <router-link class="button-a" to="/users">
        <i :class="userIconClass" aria-hidden="true"/>
      </router-link>
      <router-link class="button-a" to="/test" v-if="debug">
        <i class="fa fa-fw fa-rocket" aria-hidden="true"/>
      </router-link>
    </div>
    <div class="navbar-flex-bottom">
      <button class="button-a" @click="toggleGitterChat">
        <i class="fa fa-fw fa-comments" aria-hidden="true"/>
      </button>
      <button class="button-a" @click="openListener">
        <i class="fa fa-bar-chart" aria-hidden="true"/>
      </button>
      <a class="button-a"
         target="_blank"
         :href="githubURL">
        <i class="fa fa-fw fa-github" aria-hidden="true"/>
      </a>
      <a class="button-a"
         target="_blank"
         :href="helpURL">
        <i class="fa fa-fw fa-book" aria-hidden="true"/>
      </a>
      <router-link class="button-a" to="/signout">
        <i class="fa fa-fw fa-sign-out" aria-hidden="true"/>
      </router-link>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import chat from '@/util/chat'

  export default {
    name: 'Navbar',
    data () {
      return {
        gitter: false,
        debug: config.get('debug'),
        helpURL: config.get('helpURL'),
        githubURL: config.get('githubURL')
      }
    },
    computed: {
      ...mapState([
        'user'
      ]),
      userIconClass () {
        return [
          'fa fa-fw',
          this.user.administrator
            ? 'fa-users'
            : 'fa-user'
        ]
      }
    },
    methods: {
      toggleGitterChat () {
        chat.toggle()
      },
    openListener () {
        window.open(config.get('listenURL'))
      }
    }

  }
</script>
<style lang="scss">
@import "~styles/colors";

$width: 60px;
$height: 100vh;
$color: #8898A5;
$color-active: #5CA1DF;
$grey-light: mix($color, #fff, 75%);

$button-size: 36px;
$button-size-small: 32px;

.navbar {
  display: flex;
  flex-direction: column;

  position: fixed;
  left: 0;
  top: 0;
  width: $width;
  height: $height;

  background: white;
  border-right: 1px solid #eaeefb;
  box-shadow: 0 0 8px 0 rgba(232,237,250,.6), 0 2px 4px 0 rgba(232,237,250,.5);

  font-size: 14px;

  .navbar-flex-top {
    flex: 0 0 $width;
    text-align: center;
    line-height: $width;
  }

  .navbar-flex-middle {
    flex: 1 0 auto;
  }

  .navbar-flex-bottom {
    flex: 0 1 auto;
  }
}

.button-a {
  display: block;
  position: relative;

  text-align: center;
  text-decoration: none;
  overflow: hidden;

  color: $color;
  background: transparent;

  border: 0;
  margin: 0;
  padding: 0;

  cursor: pointer;

  width: $button-size;
  height: $button-size;
  line-height: $button-size;
  margin-left: 10px;
  border-radius: 3px;

  &.align-left {
    margin-left: 0;
    margin-right: 10px;
  }

  &.small {
    width: $button-size-small;
    height: $button-size-small;
    line-height: $button-size-small;
    font-size: 12px;
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.5;
  }

  &.router-link-active, &.blue {
    background: $color-active;
    box-shadow: 0 4px 8px 0 rgba(#5CA1DF, 0.4);
    color: white;
  }

  &.grey {
    background: $color;
    box-shadow: 0 4px 8px 0 rgba($color, 0.4);
    color: white;
  }
}
</style>
