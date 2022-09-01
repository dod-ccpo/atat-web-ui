/* eslint-disable */
import Vue from 'vue'
import App from "@/App.vue";
import VueRouter from 'vue-router'
import router from "@/router"
import store  from "@/store"
import vuetify from "./plugins/vuetify";
import validation from "./plugins/validation";
import sanitize  from "./plugins/sanitize";
import { format, compareAsc } from 'date-fns';
import InputMask from "inputmask";

Vue.use(VueRouter);
Vue.use(validation);
Vue.use(sanitize);

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app')
