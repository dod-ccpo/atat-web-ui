import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AppPackageBuilder from "@/AppPackageBuilder.vue";
import SlideoutPanel from "@/store/slideoutPanel/index";

Vue.use(Vuetify);

describe("Testing FundingTracker Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(AppPackageBuilder, {
      localVue,
      vuetify,
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  it("method panelContent() - tests undefined", async () => {
    const panelContent = wrapper.vm.panelContent;
    expect(panelContent).not.toBe(undefined);
  });
 
})
