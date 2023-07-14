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
    envClassificationsCloud: ["U","S"],
    envClassificationsOnPrem: [],
  }

  const mockSaveData = {
    envClassificationsCloud: ["U"],
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
      wrapper.setData({
        currentData: mockCurrent,
        savedData: mockSaveData
      })
    })
    it("test saveOnLeave() return true", async () => {
      jest.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation(
        () => Promise.resolve()
      );
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy();
    });

    it("test saveOnLeave() error state", async () => {
      console.log = jest.fn();
      jest.spyOn(CurrentEnvironment, 'setCurrentEnvironment').mockImplementation( () => {
        throw new Error("mock error");
      });
      const saveOnLeave = await wrapper.vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    });
  });

})
