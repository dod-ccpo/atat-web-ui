/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import cssVars from "css-vars-ponyfill"; // needed to process css vars in IE11

import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATHeaderNav from "./components/ATATHeaderNav.vue";
import ATATLinkButton from "./components/ATATLinkButton.vue";
import ATATSelect from "./components/ATATSelect.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import ATATTextField from "./components/ATATTextField.vue";
import SecurityBanner from "./components/SecurityBanner.vue";
import StyledFields from "./components/StyledFields.vue";
import USAGovBanner from "./components/USAGovBanner.vue";

// wizard
import ViewPortfolio from "./wizard/Step_0/components/ViewPortfolio/ViewPortfolio.vue";
import CreatePortfolio from "./wizard/Step_0/components/CreatePortfolio/CreatePortfolio.vue";


Vue.component('atat-link-button', ATATLinkButton);
Vue.component('atat-text-field', ATATTextField);


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
