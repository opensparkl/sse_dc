/**
 * @copyright 2017 SPARKL Limited. All Rights Reserved
 * @author <yev@sparkl.com> Yevheniy Vlasenko
 *
 * Application entry point
 */
import './styles/index.scss'
import Vue from 'vue'
import Title from './plugins/Title'
import Router from 'vue-router'
import Modal from 'vue-js-modal'
import ToggleButton from 'vue-js-toggle-button'
import Notify from 'vue-notification'
import Popover from 'vue-js-popover'
import Clipboard from 'v-clipboard'
import App from './App'
import Icon from './components/elements/Icon'
import Tag from './components/elements/Tag'
import FlexSpread from './components/layout/FlexSpread'
import FlexBox from './components/layout/FlexBox'
import Panel from './components/layout/Panel'
import store from './store'
import router from './router'
import api from './api'
import Config from './util/config'

window.config = new Config(window._config)

Vue.use(Title)
Vue.use(Router)
Vue.use(Notify)
Vue.use(Modal)
Vue.use(Clipboard)
Vue.use(ToggleButton)
Vue.use(Popover, { tooltip: true })

api.setBaseUrl(config.get('router.url'))

Vue.component('Icon', Icon)
Vue.component('Tag', Tag)
Vue.component('FlexSpread', FlexSpread)
Vue.component('FlexBox', FlexBox)
Vue.component('Panel', Panel)

new Vue({
  store,
  router,
  template: '<App/>',
  components: { App }
}).$mount('#app')
