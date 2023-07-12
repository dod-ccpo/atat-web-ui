import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATExpandableLink from "@/components/ATATExpandableLink.vue";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const ariaId = "MyId";
  let expandLink: Wrapper<DefaultProps & Vue, Element>

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATExpandableLink, {
      localVue,
      vuetify,
      propsData: {
        ariaId,
      }
    });
    expandLink = wrapper.find(".expandable-content-opener");
  });

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("EVENTS", () => {
    it("test click event to expand -- link class will contain open", async () => {
      wrapper.setData({ "isOpen": true });
      await wrapper.vm.$nextTick();
      expect(expandLink.classes()).toContain("open");
    });

    it("test click event to expand -- link class will contain closed", async () => {
      wrapper.setData({ "isOpen": true });
      await wrapper.vm.$nextTick();
      expandLink.trigger("keydown.enter");
      await wrapper.vm.$nextTick();
      expect(expandLink.classes()).toContain("closed");
    });
  });

});
