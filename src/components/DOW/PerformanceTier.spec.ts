import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import PerformanceTier from "./PerformanceTier.vue";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../plugins/validation";
import { CurrEnvInstancePerformance } from "types/Global";

Vue.use(Vuetify);

const performanceTier: CurrEnvInstancePerformance = {
  performanceTier: "",
  numberOfInstances: null,
  dataEgressMonthlyAmount: null,
  dataEgressMonthlyUnit: "GB",
}


describe("Testing Classification Level Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;


  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(PerformanceTier, {
      localVue,
      vuetify,
      propsData: {
        performanceTier
      }
    });
  });

  describe("Initialization....", () => {
    it.skip("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });


})
