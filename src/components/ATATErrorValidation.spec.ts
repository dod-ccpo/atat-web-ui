import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const errorMessages = [
    "error message 00001",
    "error message 00002",
  ]
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATErrorValidation, {
      vuetify,
      localVue
    });
  });
  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("tests.....", () => {
    it("showError() - set !data.showAllErrors to ensure single error is displayed", async () => {
      await wrapper.setProps({
        showAllErrors: false,
        errorMessages
      });
      await wrapper.vm.showError;
      expect(wrapper.vm._errorMsgs).toHaveLength(1);
    });

    it("showError() - set !data.showAllErrors && props.errorMessages=[] to ensure NO " + 
        "error is displayed", async () => {
      await wrapper.setProps({
        showAllErrors: false,
        errorMessages: []
      });
      await wrapper.vm.showError;
      expect(wrapper.vm._errorMsgs).toHaveLength(0);
    });

    it("showError() - set data.showAllErrors to ensure all errors are displayed", async () => {
      await wrapper.setProps({
        showAllErrors: true,
        errorMessages
      });
      await wrapper.vm.showError;
      expect(wrapper.vm._errorMsgs).toHaveLength(2);
    });

  });


  
});
