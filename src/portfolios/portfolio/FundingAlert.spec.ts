import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import FundingAlert from "./FundingAlert.vue";
import { FundingAlertTypes } from "@/store/portfolio";

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


    it("Test isErrorAlert => fundsDelinquent", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPFundsDelinquent})
      expect(wrapper.vm.isErrorAlert).toBe(true)
    });
    it("Test isErrorAlert => popExpired", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPExpired})
      expect(wrapper.vm.isErrorAlert).toBe(true)
    });
    it("Test isErrorAlert => zeroFundsRemaining", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPZeroFundsRemaining})
      expect(wrapper.vm.isErrorAlert).toBe(true)
    });

    it("Test getAlertHeading => zeroFundsRemaining", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPZeroFundsRemaining})
      expect(wrapper.vm.getAlertHeading).toContain("out of funds")
    });
    it("Test getAlertHeading => fundsDelinquent", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPFundsDelinquent})
      expect(wrapper.vm.getAlertHeading).toContain("out of funds")
    });
    it("Test getAlertHeading => popExpired", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPExpired})
      expect(wrapper.vm.getAlertHeading).toContain("period of performance")
    });

    it("Test alertType => zeroFundsRemaining", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPZeroFundsRemaining})
      expect(wrapper.vm.alertType).toBe("error")
    });

    it("Test getAlertText => zeroFundsRemaining", async () => {
      await wrapper.setProps({fundingAlertType: FundingAlertTypes.POPZeroFundsRemaining})
      expect(wrapper.vm.getAlertText).toContain("AntiDeficiency Act")
    });
    
    
  });
});
