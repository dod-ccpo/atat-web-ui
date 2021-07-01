/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import ATATFooter from "./components/ATATFooter.vue"
import ATATSelect from "./components/ATATSelect.vue"
import ATATTextField from "./components/ATATTextField.vue"
import HelloWorld from "./components/HelloWorld.vue"

Vue.component('atat-footer', ATATFooter);
Vue.component('atat-select', ATATSelect);
Vue.component('atat-text-field', ATATTextField);
Vue.component('hello-world', HelloWorld);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
