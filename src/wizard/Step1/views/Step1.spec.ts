import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount } from "@vue/test-utils";
import axios from "axios";
import VueAxios from "vue-axios";

import Step1 from "@/wizard/Step1/views/Step1.vue";

import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATTextArea from "@/components/ATATTextArea.vue";
import ATATButtonCard from "@/components/ATATButtonCard.vue";

Vue.use(Vuetify);

//axios
axios.defaults.baseURL =
  "https://virtserver.swaggerhub.com/CCPO-ATAT/mock-atat-internal-api/1.0.0";
Vue.use(VueAxios, axios);

Vue.component("atat-button-card", ATATButtonCard);
Vue.component("atat-text-area", ATATTextArea);
Vue.component("atat-text-field", ATATTextField);
Vue.component("atat-select", ATATSelect);

describe("testing render component", () => {
  const localVue = createLocalVue();
  let vuetify: any;
  let wrapper: any;
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Step1, {
      localVue,
      vuetify,
    });
  });

  it("view display title", () => {
    expect(wrapper.html()).toContain("Portfolio Details");
  });
  it("from commponent present", () => {
    expect(wrapper.html()).toContain("Air Force");
  });
  it("check component present", () => {
    expect(wrapper.html()).toContain("Army");
  });
  it("select provider shows providers", () => {
    expect(wrapper.html()).toContain("CSP 1");
  });
});
