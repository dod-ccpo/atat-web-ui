/* eslint-disable */
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import moment from "moment";
import cssVars from "css-vars-ponyfill"; // needed to process css vars in IE11
import axios from "axios";
import VueAxios from "vue-axios";
import RouterMiddleWare, {
  RouterMiddleWareOptions,
} from "./router/routerMiddleWare";
import routeHandlers from "./router/routeHandlers";
import Inputmask from "inputmask";

// below 3 scripts for Vuetify in IE
import "core-js/stable";
import "regenerator-runtime/runtime";
import "@webcomponents/webcomponentsjs/webcomponents-bundle.js";

import ATATAlert from "./components/ATATAlert.vue";
import ATATButtonCard from "./components/ATATButtonCard.vue";
import ATATDatePicker from "./components/ATATDatePicker.vue";
import ATATDialog from "./components/ATATDialog.vue";
import ATATFileUpload from "./components/ATATFileUpload.vue";
import ATATFooter from "./components/ATATFooter.vue";
import ATATHeader from "./components/ATATHeader.vue";
import ATATHeaderNav from "./components/ATATHeaderNav.vue";
import ATATModalDelete from "./components/ATATModalDelete.vue";
import ATATSelect from "./components/ATATSelect.vue";
import ATATSideBar from "./components/ATATSideBar.vue";
import ProfileDrawer from "./components/SideDrawerComponents/ProfileDrawer.vue";
import SubmitDrawer from "./components/SideDrawerComponents/SubmitDrawer.vue";
import TeamMemberRolesDrawer from "./components/SideDrawerComponents/TeamMemberRolesDrawer.vue";
import ATATTextField from "./components/ATATTextField.vue";
import ATATTextArea from "./components/ATATTextArea.vue";
import ATATSummaryCard from "./components/ATATSummaryCard.vue";
import ATATToast from "./components/ATATToast.vue";
import SecurityBanner from "./components/SecurityBanner.vue";
import StyledFields from "./components/StyledFields.vue";
import USAGovBanner from "./components/USAGovBanner.vue";

// wizard
import ViewPortfolio from "./views/wizard/Step_0/components/ViewPortfolio/ViewPortfolio.vue";
import CreatePortfolio from "./views/wizard/Step_0/components/CreatePortfolio/CreatePortfolio.vue";
import { createSolutionBuilderWithWatch } from "typescript";
import VuexPersistence from "vuex-persist";
Vue.component("atat-button-card", ATATButtonCard);
Vue.component("atat-date-picker", ATATDatePicker);
Vue.component("atat-dialog", ATATDialog);
Vue.component("atat-file-upload", ATATFileUpload);
Vue.component("atat-modal-delete", ATATModalDelete);
Vue.component("atat-select", ATATSelect);
Vue.component("atat-summary-card", ATATSummaryCard);
Vue.component("atat-text-area", ATATTextArea);
Vue.component("atat-text-field", ATATTextField);
Vue.component("atat-toast", ATATToast);

//axios
axios.defaults.baseURL =
  "https://virtserver.swaggerhub.com/CCPO-ATAT/mock-atat-internal-api/1.0.0";
Vue.use(VueAxios, axios);

Vue.config.productionTip = false;
Vue.prototype.moment = moment;

Vue.use(RouterMiddleWare, {
  store: store,
  router: router,
  handlers: routeHandlers,
});

// needed to process css vars in IE11
cssVars({
  rootElement: document,
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
/* eslint-disable */
