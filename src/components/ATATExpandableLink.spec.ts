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
    it("expands and collapses", async () => {
      const expandLink = wrapper.find(".expandable-content-opener");
      expect(expandLink.classes("closed")).toBe(true);

      const content = wrapper.find("#Content_" + ariaId);
      expect(content.isVisible()).toBe(false);
      
      expandLink.trigger("click");

      wrapper.vm.$nextTick(async () => {
        expect(content.isVisible()).toBe(true);
        expect(expandLink.classes()).toContain("open");
        expandLink.trigger("click");
        wrapper.vm.$nextTick(() => {
          expect(expandLink.classes()).toContain("closed");
          expect(content.isVisible()).toBe(false);
        });
      });
    });

  });

});
