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

  Router view for authenticated routes.
-->
<template>
  <div class="widget">
    <navbar/>
    <modals/>
    <notifications
      :speed="300"
      :duration="3000"
      position="bottom right"/>
    <div class="widget-content">
      <router-view/>
    </div>
  </div>
</template>
<script>
  import Navbar from './Navbar'
  import Modals from './Modals'
  import api from '@/api'

  export default {
    name: 'Container',
    components: {
      Navbar,
      Modals
    },
    data () {
      return {
        timer: null
      }
    },
    mounted () {
      window.addEventListener('focus', this.onWindowFocus)
      this.startTimer()
    },
    beforeDestroy () {
      window.removeEventListener('focus', this.onWindowFocus)
      this.stopTimer()
    },
    methods: {
      onWindowFocus () {
        api.user.self().then(response => {
          if (response.data.attr.id === 'G-0-0-0') {
            this.$notify({
              type: 'error',
              duration: 600000,
              title: 'Authentication',
              text: 'Your session has expired. Please sign in again'
            })

            this.$router.push({ path: '/signout' })
          }
        })
      },

      startTimer () {
        this.timer = setInterval(api.ping, 60000)
      },

      stopTimer () {
        clearTimeout(this.timer)
      }
    }

  }
</script>
<style lang="scss">
  @import "~styles/colors";

  .widget {
    display: block;
    box-sizing: border-box;
    min-height: 100vh;
    padding-left: 60px;

    .widget-content {
      display: block;
      box-sizing: border-box;
      width: 100%;
    }
  }
</style>
