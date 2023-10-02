import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import FundingAlert from "./FundingAlert.vue";

Vue.use(Vuetify);

describe("Testing Funding Alert", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(FundingAlert, {
      vuetify,
      localVue
    });
  });

  describe("testing Funding Alert", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  
    
  });
});
