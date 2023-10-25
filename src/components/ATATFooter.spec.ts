
import { mount } from "@vue/test-utils";
import ATATFooter from "@/components/ATATFooter.vue";
import { expect,  describe } from "vitest";
import vuetify from "@/plugins/vuetify";


describe("Testing Footer Component", () => {
  const wrapper = mount(ATATFooter, {
    global:{
      plugins: [vuetify]
    }
  });

  it("renders successfully", async () => {
    console.log('here')
    expect(wrapper.exists()).toBe(true);
    expect(wrapper.classes()).toContain("width-100")
  });
  // DMG Test was failing after comment removing non-functional links and buttons 12/29/2022
  // it("should have three links", async () => {
  //   const links = await wrapper.findAll("._text-link")
  //   expect(links.length).toEqual(3)
  //   expect(links.at(0).text()).toEqual("Security Notice")
  //   expect(links.at(1).text()).toEqual("Privacy")
  //   expect(links.at(2).text()).toEqual("Accessibility")
  // })
});
