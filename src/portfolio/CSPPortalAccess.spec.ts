import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import CSPPortalAccess from "@/portfolio/CSPPortalAccess.vue";
Vue.use(Vuetify);

describe("Testing CSPPortalAccess Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CSPPortalAccess, {
      localVue,
      vuetify,
      propsData:{
        portfolioCSP: "Azure"
      }
    });
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
})
