/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import cssVars from "css-vars-ponyfill"; // needed to process css vars in IE11
import axios from 'axios';
import VueAxios from 'vue-axios'


import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATHeaderNav from "./components/ATATHeaderNav.vue";
import ATATSelect from "./components/ATATSelect.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import ATATTextField from "./components/ATATTextField.vue";
import ATATTextArea from "./components/ATATTextArea.vue";
import ATATButtonCard from "./components/ATATButtonCard.vue";
import ATATDatePicker from "./components/ATATDatePicker.vue";
import ATATFileUpload from "./components/ATATFileUpload.vue";
import ATATTable from "./components/ATATTable.vue"
import SecurityBanner from "./components/SecurityBanner.vue";
import StyledFields from "./components/StyledFields.vue";
import USAGovBanner from "./components/USAGovBanner.vue";

// wizard
import ViewPortfolio from "./wizard/Step_0/components/ViewPortfolio/ViewPortfolio.vue";
import CreatePortfolio from "./wizard/Step_0/components/CreatePortfolio/CreatePortfolio.vue";
Vue.component('atat-date-picker',ATATDatePicker)
Vue.component('atat-button-card', ATATButtonCard);
Vue.component('atat-file-upload', ATATFileUpload);
Vue.component('atat-text-area', ATATTextArea);
Vue.component('atat-text-field', ATATTextField);
Vue.component('atat-select', ATATSelect);
Vue.component('atat-table', ATATTable);

//axios
axios.defaults.baseURL = "https://virtserver.swaggerhub.com/CCPO-ATAT/mock-atat-internal-api/1.0.0"
Vue.use(VueAxios, axios);

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
/* eslint-disable */