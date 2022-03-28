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
  let radioButtonTwo: Wrapper<Vue, Element>;
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
    radioButtonTwo = wrapper.find('input[type="radio"][value="RadioTwo"]');
  });
  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("legend screen reader only", async()=>{
      const legendSrOnly = wrapper.find(".d-sr-only");

      await wrapper.setProps({legendSrOnly: true});
      expect(legendSrOnly).toBeDefined;
      
      await wrapper.setProps({legendSrOnly: false});
      expect(legendSrOnly).toBeUndefined;
    });

    it("radio buttons disabled", async()=>{
      const disabledRadio = wrapper.find(".v-radio--is-disabled");

      await wrapper.setProps({disabled: true});
      expect(disabledRadio).toBeDefined;
      
      await wrapper.setProps({disabled: false});
      expect(disabledRadio).toBeUndefined;
    });
  });

  describe("DATA", () => { 
    it("items.length", async () => {
      expect(wrapper.props('items').length).toBe(3);
    }); 
  });

  describe("EVENTS", () => {
    it("onBlur", async () => {
      radioButtonTwo.trigger("blur");
      wrapper.vm.$nextTick(() => {
        const radioButton = radioButtonTwo.element as HTMLInputElement;
        expect(radioButton.checked).toBe(false);
      });
    });

    it("onClick", async () => {
      wrapper.setData({"errorMessages": ["error_msg_01"]});
      expect(wrapper.vm.$data.errorMessages.length).toBe(1);
      radioButtonTwo.trigger("click");
      wrapper.vm.$nextTick(() => {
        expect(wrapper.vm.$data.errorMessages.length).toBe(0);
      });
    });
  });
  describe("WATCHERS", () => {
    it("valueChange", async () => {
      wrapper.setProps({"value":"new_value"});
      await wrapper.vm.$nextTick(() => {
        expect(wrapper.emitted("radioButtonSelected")?.flat()[0]).toMatch("new_value");
      });
    });
  });
});
