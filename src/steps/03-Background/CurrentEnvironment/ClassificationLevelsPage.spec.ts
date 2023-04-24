import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import ClassificationLevelsPage
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelsPage.vue";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";



Vue.use(Vuetify);

describe("Testing Classification Level Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const allClassificationLevels = [

    {
      "sys_id": "class1",
      "sys_mod_count": "0",
      "impact_level": "IL4",
      "classification": "U",
    },
    {
      "sys_id": "class2",
      "sys_mod_count": "0",
      "impact_level": "",
      "classification": "TS",
    },
    {
      "sys_id": "class3",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "classification": "S",
    },
    {
      "sys_id": "class4",
      "sys_mod_count": "0",
      "impact_level": "IL2",
      "classification": "U",
    },
    {
      "sys_id": "class5",
      "sys_mod_count": "0",
      "impact_level": "IL5",
      "classification": "U",
    }
  ]
  const selectedClassifications = [
    {
      "classification": "U",
      "impact_level": "IL4",
      "sys_id": "class1",
      "sys_mod_count": "0",
    },
    {
      "classification": "U",
      "impact_level": "IL5",
      "sys_id": "class5",
      "sys_mod_count": "0",
    },
    {
      "classification": "U",
      "impact_level": "IL2",
      "sys_id": "class4",
      "sys_mod_count": "0",
    },
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClassificationLevelsPage, {
      localVue,
      vuetify,
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

  });

})
