import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import ATATFooter from "@/components/ATATFooter.vue";


describe("Testing Footer Component", () => {


  const wrapper: VueWrapper = shallowMount(ATATFooter, {})

  it("renders successfully", async () => {
    const footer = wrapper.findComponent(ATATFooter)
    expect(footer.exists()).toBe(true);
    expect(footer.classes()).toContain("width-100")
  });
  
});
