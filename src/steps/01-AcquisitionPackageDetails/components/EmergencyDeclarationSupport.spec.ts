import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import emergencyDeclarationSupport  
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";


describe("Testing index Component", () => {
  const wrapper: VueWrapper = shallowMount(emergencyDeclarationSupport, {
    props: {},
    global: {
      plugins: []
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

 
})
