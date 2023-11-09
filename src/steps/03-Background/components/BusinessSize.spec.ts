import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";

describe("Testing BusinessSize Component", () => {

  const wrapper: VueWrapper = shallowMount(BusinessSize);
  const vm =  (wrapper.vm as typeof wrapper.vm.$options);


  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("ensure setReadOnly() =>", () => {
    beforeEach(() => {
      wrapper.setProps({
        isForm: false,
      });
    });
   
    it("returns YES", async () => {
      await wrapper.setProps({
        businessSize: ""
      })
      await vm.setReadOnly();
      expect(vm.selectedBusinessSizeReadOnly).toEqual("YES");
    });
  
    it("returns NO", async () => {
      await wrapper.setProps({
        businessSize: "NO_NONE"
      })
      await vm.setReadOnly();
      expect(vm.selectedBusinessSizeReadOnly).toEqual("NO");
    });
  })
});
