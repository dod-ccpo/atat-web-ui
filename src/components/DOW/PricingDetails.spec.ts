import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import PricingDetails from "./PricingDetails.vue";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../plugins/validation";
import { CurrEnvInstancePricingDetails } from "types/Global";

Vue.use(Vuetify);

const pricingDetails: CurrEnvInstancePricingDetails = {
  currentPaymentArrangement: "",
  pricingPeriodExpirationDate: "",
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
    wrapper = mount(PricingDetails, {
      localVue,
      vuetify,
      propsData: {
        pricingDetails
      }
    });
  });

  describe("Initialization...", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

  describe("Watchers...", () => {
    it("tests reset of period expiration date", async () => {
      wrapper.vm.$props.pricingDetails.pricingPeriodExpirationDate = "foo";
      Vue.nextTick(() => {
        wrapper.vm.$props.pricingDetails.currentPaymentArrangement = "PAYASYOUGO";
        Vue.nextTick(() => {
          expect(wrapper.vm.$props.pricingDetails.pricingPeriodExpirationDate).toBe("");
        });
      });

    });

  });

});
