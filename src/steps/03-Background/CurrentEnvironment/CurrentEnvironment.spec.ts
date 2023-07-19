/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import validators from "../../../plugins/validation";
// eslint-disable-next-line max-len
import CurrentEnvironmentComponent from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue"
import { CurrentEnvironmentDTO } from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";





describe("Testing CurrentEnvironment Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  const mockEnvironment:CurrentEnvironmentDTO = {
    current_environment_exists: "YES"
  } as CurrentEnvironmentDTO

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentEnvironmentComponent, {
      localVue,
      vuetify,
    });
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
