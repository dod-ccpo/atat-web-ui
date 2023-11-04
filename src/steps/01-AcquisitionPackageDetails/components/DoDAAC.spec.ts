import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import validators from "@/plugins/validation";
import DoDAAC from "@/steps/01-AcquisitionPackageDetails/components/DoDAAC.vue";

describe("Testing DoDAAC Component", () => {

  const wrapper: VueWrapper = shallowMount(DoDAAC, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("sets value on input focus", async () => {
    vm.onFocus("foo");    
    expect(vm.$data.valueOnFocus).toBe("foo");
  });
  it("sets value on input blur", async () => {
    vm.$data.valueOnFocus = "foo";
    vm.onBlur("bar");   
    expect(wrapper.emitted().valueChange).toBeTruthy(); 

  });


});
