/* eslint-disable camelcase */
import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuetify from "vuetify";
import Vue from "vue";
import validators from "../../../plugins/validation";
// eslint-disable-next-line max-len
import CurrentEnvironmentComponent from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue"
import { CurrentEnvironmentDTO } from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";

describe("Testing CurrentEnvironment Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  const vuetify = new Vuetify();
  const wrapper = shallowMount(CurrentEnvironmentComponent, {
    vuetify,
    localVue
  });

  const mockEnvironment:CurrentEnvironmentDTO = {
    current_environment_exists: "YES"
  } as CurrentEnvironmentDTO

  beforeEach(() => {
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test CurrentData to get coverage for branch", async () => {
    wrapper.setData({currentEnvironmentExists:""})
    await Vue.nextTick()
    const currentData = wrapper.vm.currentData
    expect(currentData).toStrictEqual({"current_environment_exists": ""});

  })
  it("test saveOnLeave to return true", async () => {
    wrapper.setData({currentEnvironmentExists:""})
    await Vue.nextTick()
    const saveOnLeave = await wrapper.vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy();
  })

});
