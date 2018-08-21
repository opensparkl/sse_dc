<template>
  <div id="app">
    <tooltip/>
    <router-view/>
  </div>
</template>
<script>
import api from './api'

export default {
  name: 'App',
  beforeMount () {
    this.setDefaultRouter()
    this.$store.commit('INIT_SESSION')
  },
  methods: {
    setDefaultRouter () {
      let routerURL = config.get('router.url')

      if (config.get('router.url') === '') {
        routerURL = window.location.origin
        console.warn(`Config URL is empty, using ${routerURL}`)

        config.set('router.url', routerURL)
        api.setBaseUrl(routerURL)
      }

      console.log(`Router URL: ${routerURL}`)
    }
  }
}
</script>

<style lang="scss">
body {
  background: #F9FAFC;
  color: rgb(71, 71, 71);
}

#app {
  font-family: 'Lato', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 14px;
}
</style>
