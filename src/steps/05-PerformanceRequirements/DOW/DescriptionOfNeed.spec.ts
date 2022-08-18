import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import validators from "../../../plugins/validation";
import { DefaultProps } from "vue/types/options";

import DescriptionOfNeed from "./DescriptionOfNeed.vue";

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
    wrapper = mount(DescriptionOfNeed, {
      localVue,
      vuetify,
      mocks: {
        // $store: {
        //   DescriptionOfWork: {
        //     computeObject: computeData,
        //   }
        // },

      },
      propsData: {
        // computeData: computeData
      }
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);

    });
  });

  describe("Validation....", () => {
    it("tests that textarea required message is displayed", async () => {
      wrapper.setProps({ _andticipatedNeedUsage: "test text"});

      const textArea = await wrapper.findComponent({ref: "DescriptionOfNeed"});
      expect(textArea.exists()).toBe(true);
      expect(textArea.vm.$data.errorMessages.length).toBe(0);
      
      wrapper.setProps({ _andticipatedNeedUsage: ""});
      // const validateRequired = textArea.vm.$children[0].$validators.required;
      const validateRequired = jest.fn();

      // textArea.trigger("click");
      // textArea.trigger("blur");
      expect(validateRequired).toHaveBeenCalled();

      // textArea.vm.validate();
      // expect(textArea.vm.$data.errorMessages.length).toBe(1);
      console.log("textArea:", textArea.vm.$children[0].$validators.required);
      // let errorMessage = wrapper.findComponent(
      //   { ref: "ErrorMessage_AnticipatedNeedUsage_1" } 
      // );
      // textArea.trigger("click");
      // textArea.trigger("blur");
      // expect(errorMessage.exists()).toBe(false)
      // // expect no error message?

      // wrapper.setProps({ _andticipatedNeedUsage: ""});
      // errorMessage = wrapper.findComponent(
      //   { ref: "ErrorMessage_AnticipatedNeedUsage_1" } 
      // );
      // // blur?
      // // then expect error message?
      // textArea.trigger("click");
      // textArea.trigger("blur");

      // expect(errorMessage.exists()).toBe(true)
      // console.log(errorMessage);

    });
  });



});