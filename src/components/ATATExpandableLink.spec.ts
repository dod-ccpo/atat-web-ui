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

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATExpandableLink, {
      localVue,
      vuetify,
      propsData: {
        ariaId,
      }
    });
  });

  describe("INITIALIZATION", () => { 
      it("renders successfully", async () => {
        expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("ariaId defined", async()=>{
      expect(wrapper.find("#Button_" + ariaId)).toBeDefined;
      await wrapper.setProps({ ariaId: null })
      expect(wrapper.vm.ariaId).toBe(null)
    });
  });

  describe("EVENTS", () => {
    it("clicks to expand", async () => {
      wrapper.setData({ "open": false });
      const expandLink = wrapper.find(".expandable-content-opener");
      expect(expandLink.classes("closed")).toBe(true);

      const content = wrapper.find("#Content_" + ariaId);
      expect(content.isVisible()).toBe(false);
      
      expandLink.trigger("click");

      wrapper.vm.$nextTick(async () => {
        expect(content.isVisible()).toBe(true);
        expect(expandLink.classes()).toContain("open");
      });
    });

    it("presses enter key to close", async () => {
      wrapper.setData({ "open": true });
      wrapper.vm.$nextTick(async () => {
        const expandLink = wrapper.find(".expandable-content-opener");
        expect(expandLink.classes("open")).toBe(true);

        const content = wrapper.find("#Content_" + ariaId);
        expect(content.isVisible()).toBe(true);
        
        expandLink.trigger("keydown.enter");
        wrapper.setData({ "open": false });

        wrapper.vm.$nextTick(async () => {
          expect(content.isVisible()).toBe(false);
          expect(expandLink.classes()).toContain("closed");
        });
      });
    });



  });

});
