/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import validators from "../../../plugins/validation";
// eslint-disable-next-line max-len
import CurrentEnvironmentComponent from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironment.vue"
import { CurrentEnvironmentDTO } from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";





describe("Testing CurrentEnvironment Component", () => {
  const mockEnvironment:CurrentEnvironmentDTO = {
    current_environment_exists: "YES"
  } as CurrentEnvironmentDTO

  const wrapper:VueWrapper = shallowMount(CurrentEnvironmentComponent, {
    props: {

    },
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  beforeEach(() => {
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("test CurrentData to get coverage for branch", async () => {
    wrapper.setData({currentEnvironmentExists:""})
    await vm.$nextTick()
    const currentData = vm.currentData
    expect(currentData).toStrictEqual({"current_environment_exists": ""});

  })
  it("test saveOnLeave to return true", async () => {
    wrapper.setData({currentEnvironmentExists:""})
    await vm.$nextTick()
    const saveOnLeave = await vm.saveOnLeave()
    expect(saveOnLeave).toBeTruthy();
  })

});
