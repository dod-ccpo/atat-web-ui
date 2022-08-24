import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import ServiceOfferingDetails from "../DOW/ServiceOfferingDetails.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";

Vue.use(Vuetify);

describe("Testing ServiceOfferingDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);  
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const avlClassificationLevelObjects = [
    {
      "sys_id": "1234567890",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "classification": "S",
    },
    {
      "sys_id": "cc3b52af87970590ec3b777acebb3581",
      "sys_mod_count": "0",
      "impact_level": "IL2",
      "classification": "U",
    }
  ];

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ServiceOfferingDetails, {
      localVue,
      vuetify,
      propsData: {
        avlClassificationLevelObjects: avlClassificationLevelObjects,
        singleClassificationLevelName: "",
      },
    });
  });

  describe("Initialization...", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Methods...", () => {
    it("tests that single classification level label is set", async () => {
      await wrapper.setData({
        avlInstancesLength: 1,
        avlClassificationLevelObjects: [avlClassificationLevelObjects[0]]
      });
      await wrapper.vm.checkSingleClassification();
      const classLevelName = wrapper.vm.$data.singleClassificationLevelName;
      expect(classLevelName).toContain(
        wrapper.vm.$data.avlClassificationLevelObjects[0].impact_level
      );
    });
  });

});
