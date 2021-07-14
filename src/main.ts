/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from 'moment';
import cssVars from 'css-vars-ponyfill'; // needed to process css vars in IE11

import ATATFooter from "./components/ATATFooter.vue";
import ATATSelect from "./components/ATATSelect.vue";
import ATATTextField from "./components/ATATTextField.vue";
import StyledFields from "./components/StyledFields.vue";
import ATATSideBar from "./components/ATATSideBar.vue"


Vue.component('atat-footer', ATATFooter);
Vue.component('atat-select', ATATSelect);
Vue.component('atat-sidebar', ATATSideBar);
Vue.component('atat-text-field', ATATTextField);
Vue.component('styled-fields', StyledFields);


Vue.config.productionTip = false;
Vue.prototype.moment = moment;

// needed to process css vars in IE11
cssVars({
  rootElement: document
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
