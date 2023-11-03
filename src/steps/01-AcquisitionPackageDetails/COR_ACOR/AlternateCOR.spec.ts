/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import AlternateCOR from "@/steps/01-AcquisitionPackageDetails/COR_ACOR/AlternateCOR.vue";
import validators from "../../../plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { createStore } from 'vuex';


describe("Testing AlternateCOR Component", () => {
  const actions = {
    setHasAlternateCOR: vi.fn().mockReturnValue(false)
  }
  const mockStore = createStore({
    modules: {
      AcquisitionPackage: {
        namespaced: true,
        actions
      }
    }
  })
  const wrapper: VueWrapper = shallowMount(AlternateCOR, {
    props: {},
    global: {
      plugins: [mockStore,validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    AcquisitionPackage.setHasAlternateCOR(true)
  })

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("hasAlternateCOR() - should set the 'removeAcor' data of the component based on " +
    "what is configured", async () => {
    await wrapper.setData({
      hasAlternateCOR: 'false'
    });

    expect(vm.$data.removeAcor).toBe(false);
    
    await wrapper.setData({
      hasAlternateCOR: 'true'
    });
    expect(vm.$data.removeAcor).toBe(false);
  });

  it("saveOnLeave() - should call the store and save if remove acor is set", async () => {
    vi.spyOn(AcquisitionPackage, 'removeACORInformation').mockImplementation(
      () => Promise.resolve()
    );
    vm.$data.removeAcor = true;
    await vm.saveOnLeave();
    expect(AcquisitionPackage.removeACORInformation).toHaveBeenCalled();
  });
})
