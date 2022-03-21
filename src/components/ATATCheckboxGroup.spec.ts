import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { DefaultProps } from "vue/types/options";
import { Checkbox } from "../../types/Global";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const items: Checkbox[] = [
    {
      id: "CheckboxOne",
      label: "CheckboxOne",
      value: "CheckboxOne",
    },
  ];  
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATCheckboxGroup, {
      localVue,
      vuetify,
      propsData: {
        items,
        disabled: false,
        card: false,
      }
    });
  });

  describe("INITIALIZATION", () => { 
      it("renders successfully", async () => {
        expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("disables checkboxes", async()=>{
      await wrapper.setProps({ disabled: true });
      expect(wrapper.find(".v-input--is-disabled")).toBeDefined;

      await wrapper.setProps({ disabled: false });
      expect(wrapper.find(".v-input--is-disabled")).toBeUndefined;
    });

    it("adds error classes", async()=>{
      await wrapper.setProps({ error: true });
      expect(wrapper.find(".error--text")).toBeDefined;

      await wrapper.setProps({ error: false });
      expect(wrapper.find(".error--text")).toBeUndefined;
    });

    it("styles items in a card", async()=>{
      await wrapper.setProps({ card: true });
      expect(wrapper.find("._checkbox-card")).toBeDefined;

      await wrapper.setProps({ card: false });
      expect(wrapper.find("._checkbox-card")).toBeUndefined;
    });
  });

});
