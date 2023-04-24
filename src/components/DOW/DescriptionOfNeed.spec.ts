import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import validators, { ValidationPlugin } from "../../plugins/validation";
import { DefaultProps } from "vue/types/options";

import { init, generateString, validateInput } from "@/helpers/unitTests";

import DescriptionOfNeed from "./DescriptionOfNeed.vue";
import { mocked } from 'ts-jest/utils';

Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(DescriptionOfNeed, {
      localVue,
      vuetify,
      propsData: {
        index: 0,
        anticipatedNeedUsage: "test text",
      }
    });
    
    // needed for helper functions
    await init(wrapper, localVue);
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Validation....", () => {
    it(`tests that Description of Anticipated Usage and Need textarea 
      REQUIRED validation is triggered`, async () => {
      const props = { anticipatedNeedUsage: "" };
      const success = await validateInput("required", props, "DescriptionOfNeed", 0);
      expect(success).toBeTruthy();
    });

    it(`tests that Description of Anticipated Usage and Need textarea 
      MAX LENGTH (500 chars) validation is triggered`, async () => {
      const tooLongString: string = await generateString(501);
      const props = { anticipatedNeedUsage: tooLongString };
      const success = await validateInput("maxLength", props, "DescriptionOfNeed", 0);
      expect(success).toBeTruthy();
    });    

  });

});
