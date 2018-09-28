import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import VueIcon from 'vue-icon'

Vue.use(BootstrapVue);
Vue.use(VueResource);
Vue.use(VueIcon, 'v-icon');

new Vue({
  el: '#app',
  render: h => h(App)
})
