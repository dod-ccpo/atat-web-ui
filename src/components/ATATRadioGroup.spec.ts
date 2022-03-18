import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import { RadioButton } from "../../types/Global";
import { DefaultProps } from "vue/types/options";
Vue.use(Vuetify);

describe("Testing ATATRadioGroup Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const items: RadioButton[] = [
    {
      id: "RadioOne",
      label: "RadioOne",
      value: "RadioOne",
    },
    {
      id: "RadioTwo",
      label: "RadioTwo",
      value: "RadioTwo",
    },
    {
      id: "RadioThree",
      label: "RadioThree",
      value: "RadioThree",
    },
  ];
  const value = "RadioOne";
  const legendSrOnly = false;
  const disabled = false;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATRadioGroup, {
      localVue,
      vuetify,
      propsData: {
        items,
        value,
        legendSrOnly,
        disabled,
      }
    });
  });
  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("legend screen reader only", async()=>{
      await wrapper.setProps({legendSrOnly: true});
      expect(wrapper.find(".d-sr-only")).toBeDefined;
      
      await wrapper.setProps({legendSrOnly: false});
      expect(wrapper.find(".d-sr-only")).toBeUndefined;
    });

    it("radio buttons disabled", async()=>{
      await wrapper.setProps({disabled: true});
      expect(wrapper.find(".v-radio--is-disabled")).toBeDefined;
      
      await wrapper.setProps({disabled: false});
      expect(wrapper.find(".v-radio--is-disabled")).toBeUndefined;
    });
  });

  describe("DATA", () => { 
    it("items.length", async () => {
      const items = wrapper.props('items');
      expect(items.length).toBe(3);
    }); 
  });

  describe("EVENTS", () => {
    it("onClick and onBlur", async () => {
      expect(wrapper.vm).toHaveProperty("_selectedValue", "RadioOne");
      const radio = wrapper.find('input[type="radio"][value="RadioTwo"]');
      await radio.setChecked();
      await wrapper.vm.$nextTick(() => {
        const radioHTML = radio.element as HTMLInputElement;
        expect(radioHTML.checked).toBeTruthy();
        radio.trigger("click");
        radio.trigger("blur");
      });
      await wrapper.setProps({ value: "RadioThree" })
    });
  });

});
