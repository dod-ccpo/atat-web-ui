import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import BusinessSize from "@/steps/03-Background/components/BusinessSize.vue";

describe("Testing BusinessSize Component", () => {

  const wrapper: VueWrapper = shallowMount(BusinessSize);


  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("ensure setReadOnly() =>", () => {
    beforeEach(() => {
      wrapper.setData({
        isForm: false,
      });
    });
   
    it("returns YES", async () => {
      await wrapper.setProps({
        businessSize: ""
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedBusinessSizeReadOnly).toEqual("YES");
    });
  
    it("returns NO", async () => {
      await wrapper.setProps({
        businessSize: "NO_NONE"
      })
      await wrapper.vm.setReadOnly();
      expect(wrapper.vm.$data.selectedBusinessSizeReadOnly).toEqual("NO");
    });
  })
});
