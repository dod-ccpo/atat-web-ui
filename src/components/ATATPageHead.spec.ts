import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATPageHead from "@/components/ATATPageHead.vue";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATPageHead Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const headline = "New Acquisition";

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATPageHead, {
      localVue,
      vuetify,
      propsData: {
        headline,
      }
    });
  });

  it("renders successfully", async () => {
    const header = wrapper.findComponent(ATATPageHead)
    expect(header.exists()).toBe(true);
    expect(header.classes()).toContain("_atat-page-header")
    expect(header.classes()).toContain("v-app-bar")
  });

  it("headline display correctly", async () => {
    const headerSpan = wrapper.find(".h3");
    expect(headerSpan.exists()).toBe(true);
    expect(headerSpan.text()).toBe(headline)
  });
  // DMG Test was failing after comment removing non-functional links and buttons 12/29/2022
  // it("expected person button display in page head", async () => {
  //   const personButton = wrapper.find("#Person_Button");
  //   expect(personButton.exists()).toBe(true);
  //   const personIcon = personButton.find(".v-icon");
  //   expect (personIcon.text()).toBe("person_add_alt_1");
  // });
  //
  // it("expected more button display in page head", async () => {
  //   const moreButton = wrapper.find("#MoreMenuButton");
  //   expect(moreButton.exists()).toBe(true);
  //   const moreIcon = moreButton.find(".v-icon");
  //   expect (moreIcon.text()).toBe("more_horiz");
  // });
  //
  // it("moreMenuButton - menu is collapsed before being clicked", async () => {
  //   const moreMenuButton = wrapper.find("#MoreMenuButton")
  //   expect(moreMenuButton.attributes("aria-expanded")).toBe("false")
  // })
  //
  // it("moreMenuButton - dropdown menu expands after button is clicked", async () => {
  //   const moreMenuButton = wrapper.find("#MoreMenuButton")
  //   await moreMenuButton.trigger("click")
  //   expect(moreMenuButton.attributes("aria-expanded")).toBe("true")
  //   expect(moreMenuButton.emitted("click")).toBeDefined()
  // })
  //
  // it("moreMenuClick() - calls method, clicks on moreMenu to expand v-list menu " +
  //   "click a .v-list-item in the v-list to trigger method", async () => {
  //   const moreMenuButton = wrapper.find("#MoreMenuButton")
  //   await moreMenuButton.trigger("click") // expand menu
  //
  //   const listItems = wrapper.findAll(".v-list-item")
  //   expect(listItems.length).toEqual(6)
  //
  //   await listItems.at(2).trigger("click") // Portfolio Dashboard list-item
  //   Vue.nextTick(() => {
  //     expect(wrapper.vm.$data.activeAppSection).toEqual("Portfolio Dashboard")
  //   })
  // })
});
