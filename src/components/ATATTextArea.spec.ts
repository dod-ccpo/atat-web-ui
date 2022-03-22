import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATTextArea from "@/components/ATATTextArea.vue";
import {DefaultProps} from "vue/types/options";
Vue.use(Vuetify);

describe("Testing ATATTextArea Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATTextArea, {
      localVue,
      vuetify,
    });
  });

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("label", async () => {
      wrapper.setProps({
        "label":"label Test"
      });
      await wrapper.vm.$nextTick();
      expect(wrapper.find("label").exists()).toBe(true);
    });
  });

  describe("EVENTS", () => { 
    it("onInput", async () => {
      const newVal = "newVal";
      await wrapper.vm.onInput(newVal);
      await wrapper.vm.$nextTick(()=>{
        expect(wrapper.emitted("update:value")?.flat()[0]).toMatch(newVal);
      });
    });

    it("onBlur", async () => {
      const valOnBlur = "newVa";
      await wrapper.vm.onBlur(valOnBlur);
      await wrapper.vm.$nextTick(()=>{
        expect(wrapper.emitted("blur")?.flat()[0]).toMatch(valOnBlur);
      });
      
    });
  });
});
