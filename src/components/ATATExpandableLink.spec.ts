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

  describe("PROPS", () => { 
    it("ariaId", async()=>{
      expect(wrapper.find("#Button_" + ariaId)).toBeDefined;
    });
  });

  describe("EVENTS", () => {
    it("clicks to expand", async () => {
      wrapper.setData({ "open": true });
      wrapper.vm.$nextTick(async () => {
        expect(expandLink.classes()).toContain("open");
      });
    });

    it("presses enter key to close", async () => {
      wrapper.setData({ "open": true });
      expandLink.trigger("keydown.enter");
      wrapper.vm.$nextTick(async () => {
        expect(expandLink.classes()).toContain("closed");
      });
    });

  });

});
