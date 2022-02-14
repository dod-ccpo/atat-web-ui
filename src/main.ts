/* eslint-disable */
import Vue from 'vue'
import App from "@/App.vue"
import VueRouter from 'vue-router'
import router from "@/router"
import vuetify from "./plugins/vuetify";
import ATATSelect from "./components/ATATSelect.vue";


Vue.use(VueRouter);
Vue.component("atat-select", ATATSelect);

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
