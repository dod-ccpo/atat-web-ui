import { describe, it, expect, vi } from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import ATATPageHead from "@/components/ATATPageHead.vue";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


describe("Testing ATATPageHead Component", () => {
  const headline = "New Acquisition";
  const vuetify = createVuetify({
    components,
    directives,
  })
  const wrapper:VueWrapper = shallowMount(ATATPageHead, {
    global: {
      plugins: [],
    }
  })

  it("renders successfully", async () => {
    const header = wrapper.findComponent(ATATPageHead)
    expect(header.exists()).toBe(true);
    expect(header.classes()[0]).toContain("_atat-page-header")
    expect(header.findComponent('v-app-bar-stub')).toBeTruthy
  });

  it.skip("headline display correctly", async () => {
    const headerSpan = wrapper.find(".h3");
    console.log("Header",wrapper.html())
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
  //   expect (moreIcon.text()).toBe("mdi-dots-horizontal");
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
