/* eslint-disable camelcase */
import Vue from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import ClassificationLevelsPage
  from "@/steps/03-Background/CurrentEnvironment/ClassificationLevelsPage.vue";
import { config, createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { CurrentEnvironmentDTO } from "@/api/models";




Vue.use(Vuetify);

describe("Testing Classification Level Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const mockEnvironment:CurrentEnvironmentDTO = {
    env_location: "HYBRID"
  } as CurrentEnvironmentDTO
  const mockCurrent = {
    envClassificationsCloud: [],
    envClassificationsOnPrem: [],
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ClassificationLevelsPage, {
      localVue,
      vuetify,
    });
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
  });

  describe("FUNCTIONS", () => {
    beforeEach(() => {
      wrapper.setData({})
    })
    it("test CurrentData()", async () => {

      expect(wrapper.exists()).toBe(true);
    });
    it("saveOnLeave()", async () => {
      wrapper.setData({
        currentData: {env_location: "ON_PREM"},
        savedData: {env_location: "CLOUD"}
      })
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy();
    });
  });

})
