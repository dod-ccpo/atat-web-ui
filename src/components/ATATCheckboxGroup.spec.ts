import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { DefaultProps } from "vue/types/options";
import { Checkbox } from "../../types/Global";
import _ from "lodash";
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
      value: "1",
    },
    {
      id: "CheckboxTwo",
      label: "CheckboxTwo",
      value: "2",
    },
    {
      id: "Other",
      label: "Other",
      value: "Other",
    },
    {
      id: "NONE",
      label: "NONE",
      value: "NONE",
    },

  ];  

  const rules = [(v: string) => !!v || "is required"];
  
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

    it("@Watch validateCheckboxes - set $props.rules to ensure " +
          "$data.checkboxRules === $props.rules", async ()=> {
      await wrapper.setProps({rules})
      wrapper.vm.$data.validateCheckboxes = true;
      Vue.nextTick(()=>{
        expect(wrapper.vm.$data.checkboxRules).toEqual(rules);
      })
    });

    it("otherId() - sets $props.otherValue to create id for `other` component  ", async()=>{
      const _otherValue = "Other"
      await wrapper.setProps({
        otherValue: _otherValue
      })
      const _otherId = await wrapper.vm.otherId;
      expect(_otherId).toBe(_otherValue);
    })

    it("@Watch `selected` - sets $props.otherValue to ensure default " +
      "#Other_text_field is displayed", async()=>{
      const _otherValue = "Other";
      await wrapper.setProps({
        otherValue: _otherValue,
        value: [_otherValue],
        hasOtherValue: true
      })
      const otherCheckBox = await wrapper.find("#Checkbox_Other");
      await otherCheckBox.trigger("click");
      Vue.nextTick(()=> {
        expect(wrapper.find("#Other_text_field").exists()).toBe(true)
      })
    })

    it("@Watch `selected` - sets $props.otherValue & $props.otherEntryType === textarea " +
    "to ensure Other_text_area is displayed", async()=>{
      const _otherValue = "Other";
      await wrapper.setProps({
        otherValue: _otherValue,
        value: [_otherValue],
        hasOtherValue: true,
        otherEntryType: "textarea"
      })
      const otherCheckBox = await wrapper.find("#Checkbox_Other");
      await otherCheckBox.trigger("click");
      Vue.nextTick(()=> {
        expect(wrapper.find("#Other_text_area").exists()).toBe(true)
      })
    })

    it("@Watch `selected` - ", async()=>{
      await wrapper.setProps({
        value: ["NONE"],
        hasOtherValue: true,
        otherEntryType: "textarea"
      })
      const otherCheckBox = await wrapper.find("#Checkbox_Other");
      await otherCheckBox.trigger("click");
      Vue.nextTick(()=> {
        expect(wrapper.find("#Other_text_area").exists()).toBe(true)
      })
    })


  });

});
