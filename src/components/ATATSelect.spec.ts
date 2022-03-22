import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSelect from "@/components/ATATSelect.vue";
import { SelectData } from "types/Global";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATSelect Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  const items: SelectData[] = [
    {text: "Value 01", value: "value_01"},
    {text: "Value 02", value: "value_02"},
    {text: "Value 03", value: "value_03"},
    {text: "Value 04", value: "value_04"},
    {text: "Value 05", value: "value_05"},
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSelect, {
      localVue,
      vuetify,
      propsData: {
        items,
        rules: [(v: string) => !!v || "is required"],
      }
    });

  });
  describe("INITIALIZATION", () => { 
      it("renders successfully", async () => {
        expect(wrapper.exists()).toBe(true);
    });
  });

  describe("PROPS", () => { 
    it("optional", async()=>{
      await wrapper.setProps({optional: true});
      expect(wrapper.find(".optional")).toBeDefined;
      
      await wrapper.setProps({optional: false});
      expect(wrapper.find(".optional")).toBeUndefined;
    });
  });

  describe("DATA", () => { 
    it("items.length", async () => {
      const select =  wrapper.find('.v-select');
      const items = select.props('items');
      expect(items.length).toBe(5);
    }); 
  });
 
  describe("EVENTS", () => {
    it("onChange", async () => {
      let changedValue = "value_04";
      await wrapper.vm.onChange(changedValue);
      expect(wrapper.vm.$data.selected).toEqual(changedValue);

      changedValue = "";
      await wrapper.vm.onChange(changedValue);
      expect(wrapper.vm.$data.selected).toEqual(changedValue);
    });
  });

});
