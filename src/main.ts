/* eslint-disable */
import Vue from 'vue'
import App from "@/App.vue"
import VueRouter from 'vue-router'
import router from "@/router"
import store  from "@/store"
import vuetify from "./plugins/vuetify";

Vue.use(VueRouter);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
