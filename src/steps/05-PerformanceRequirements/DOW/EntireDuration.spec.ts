import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import validators from "../../../plugins/validation";
import { DefaultProps } from "vue/types/options";

import EntireDuration from "./EntireDuration.vue";

Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EntireDuration, {
      localVue,
      vuetify,
      propsData: {
        entireDuration: "YES",
        index: 0,
        isPeriodsDataMissing: false,
        periodsNeeded: [],
        availablePeriodCheckboxItems: [
          { text: "Base Period", value: "1234" }
        ]
      }
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Validation....", () => {
    it("tests that radio group required message is displayed", async () => {
      const mockValidator = jest.spyOn(localVue.prototype.$validators, 'required')
      await wrapper.setProps({ entireDuration: ""}); 
      expect(mockValidator).toHaveBeenCalled();
    });

    it(`tests that PoP checkboxes are displayed if 'No' is selected for needed
      for entire duration`, async () => {
      const mockValidator = jest.spyOn(localVue.prototype.$validators, 'required');
      await wrapper.setProps({ entireDuration: "NO", periodsNeeded: []}); 
      expect(mockValidator).toHaveBeenCalled();    
    });    

    it(`checks that alert is shown if 'No' is selected for needed for entire duration
      and no period of performance data saved`, async () => {
      await wrapper.setProps({ entireDuration: "NO", isPeriodsDataMissing: true});
      const alert = wrapper.findComponent({ref: "PeriodRequirementsAlert_1"}) 
      expect(alert.exists()).toBe(true);  
    });    

  });

});
