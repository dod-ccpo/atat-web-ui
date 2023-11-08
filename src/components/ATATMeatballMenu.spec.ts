import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import ATATMeatballMenu from "@/components/ATATMeatballMenu.vue";



describe("Testing index Component", () => {

  const wrapper: VueWrapper = shallowMount(ATATMeatballMenu, {})
  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("menuItemClick() - emits clicked item", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (wrapper.vm as any).menuItemClick("foo");
    expect(wrapper.emitted().menuItemClick).toBeTruthy();
  })

  it("getIdText() - removes spaces etc from string", async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const str = await (wrapper.vm as any).getIdText("Foo Bar");
    expect(str).toBe("FooBar");
  })


});
