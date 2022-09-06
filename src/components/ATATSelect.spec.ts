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
        id: "TEST SELECT",
        rules: [(v: string) => !!v || "is required"],
      }
    });
  });
  
  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.findComponent(ATATSelect).classes()[0]).toBe("atat-select")
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
    it("selected - default value", async () => {
      expect(wrapper.vm.$data.selected).toEqual("");
    }); 
  });
 
  describe("EVENTS", () => {
    it("onChange() - change from default empty string", async () => {
      const changedValue = "value_04";
      await wrapper.vm.onChange(changedValue);
      expect(wrapper.vm.$data.selected).toEqual(changedValue);
      // changedValue = "";
      // await wrapper.vm.onChange(changedValue);
    });
    it("onChange() - change twice from initial empty string", async () => {
      // is this what you meant
      // break in two test
      // account for line 132
      const value = "value_01";
      const updatedValue = "value_03";
      await wrapper.vm.onChange(value);
      expect(wrapper.vm.$data.selected).toEqual(value)
      console.log("DATA - beforeChange: ", wrapper.vm.$data.selectedBeforeChange);
      console.log("PROP - beforeChange: ", wrapper.vm.$props.selectedBeforeChange);
      await wrapper.vm.onChange(updatedValue);
      expect(wrapper.vm.$data.selectedBeforeChange).toEqual(updatedValue);
    });

    it("onBlur()", async () => {
      const setErrorMessageSpy = jest.spyOn(wrapper.vm, 'setErrorMessage')
      const value = "value_03";
      
      await wrapper.vm.onBlur(value);
      expect(setErrorMessageSpy).toBeCalledTimes(1)
      expect(wrapper.emitted("blur")?.flat()[0]).toEqual(value);
    });

    it("onInput()", async () => {
      // ? still wondering about this one
      const inputValue = "ATAT"
      await wrapper.vm.onInput(inputValue)
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.selectedValue).toBe(inputValue)
      })
    });
    it("setErrorMessage()", async () => {
      const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
      // attempt at remove the errorBucket to cover the different branches
      delete (wrapper.vm.$refs.atatSelect as any).errorBucket
      await wrapper.vm.setErrorMessage()
      expect(setTimeoutSpy).toHaveBeenCalledTimes(1)
      expect(wrapper.vm.$data.errorMessages).toEqual([])
    });
  });

});
