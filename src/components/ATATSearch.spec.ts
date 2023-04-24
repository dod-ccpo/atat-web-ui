import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSearch from "@/components/ATATSearch.vue";
import { DefaultProps } from "vue/types/options";
import api from "@/api";
Vue.config.productionTip = false;
Vue.use(Vuetify);




describe("Testing ATATSearch Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let search: Wrapper<DefaultProps & Vue, Element>; 
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSearch, {
      localVue,
      vuetify,
    });
    search = wrapper.findComponent({ref: "atatSearchInput"});
  });

  afterEach(() => {
    jest.clearAllTimers();
  })

  describe("testing ATATSearch", () => {

    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("SearchWrapper")).toBeDefined()
    });

    it("set rules props then ensure the select wrapper is equal to rules props", async () => {
      expect(await search.vm.$props.rules).toEqual([])
    })

    it("@Watch errorMessagesChanged() - change $data.errorMessages to [] to " +
    "display $data.showHelpText", async () => {
      await wrapper.setData({
        errorMessages: [],
        showLoader: false
      });
      expect(await wrapper.vm.$data.showHelpText).toBe(true);
    })

    it("@Watch errorMessagesChanged() - populate $data.errorMessages to not show " +
    "$data.showHelpText", async () => {
      await wrapper.setData({
        errorMessages: ['error Message 001'],
        showLoader: true
      });
      expect(await wrapper.vm.$data.showHelpText).toBe(false);
    })

    it("onInput() - supply valid input with existing $data.errorMessages then  " +
      " ensure errorMessage has been cleared", async () => {
      const inputValue = "new inputted value";
      await wrapper.setData({
        errorMessages: ['error Message 001']
      })
      await wrapper.vm.onInput(inputValue);
      Vue.nextTick(()=>{
        // wrapper.vm.clearErrorMessages() has been called.
        expect(wrapper.vm.$data.errorMessages.length).toBe(0);
      })     
    })

    it("onInput() - supply valid input then ensure $data.showHelpText===true", async () => {
      const inputValue = "new inputted value";
      await wrapper.vm.onInput(inputValue);
      Vue.nextTick(()=>{
        expect(wrapper.vm.$props.value).toBe(inputValue);
        expect(wrapper.vm.$data.showHelpText).toBe(true);
      })     
    })

    it("search() - $props.searchType !== `EDA` returns !$data.helpText", async () => {    
      await wrapper.setProps({ 
        searchType: "OtherType",
        value: "dummyText"
      })
      await wrapper.vm.search();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.showHelpText).toBe(false);
      })
    })

    it("search() - $props.searchType !== `EDA`, accommodates for setTimeout " +
        "returns !$data.showLoader", async () => {    
      jest.useFakeTimers();
      await wrapper.setProps({ 
        searchType: "OtherType",
        value: "dummyText"
      })
      await wrapper.vm.search();
      //accommodate for setTimeout
      jest.advanceTimersByTime(3000);
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.showLoader).toBe(false);
      })
    })

    it("setErrorMessage() - provides search.$data.errorBucket automatically to ensure " +
        "$data.errorMessage === search.$data.errorBucket ", async () => {
      const errorMessages = ["error Message 001"]
      await search.setData({
        errorBucket: errorMessages
      })
      
      await wrapper.vm.setErrorMessage();  
      Vue.nextTick(()=>{
        expect(wrapper.vm.$data.errorMessages).toBe(errorMessages);
      })
    })

    it("onBlur() - call event and ensure `blur` event is emitted with $props.value ", 
      async () => {
        const value = "new input value";
        await wrapper.setProps({
          value
        })
        const tb = wrapper.find("input")
        await tb.trigger("blur");
        expect(await wrapper.emitted("blur")?.flat()[0]).toBe(value);
      })
    
    it("resetValidation() - supply $data.errorMessage[] and ensure v-text-field " +
      "errorBucket gets cleared ", async () => {
      const errorMessage = ["error Message 001"]
      await wrapper.setData({
        errorMessage
      })
      await wrapper.vm.resetValidation()
      expect(search.vm.$data.errorBucket).toEqual([]);
    })
 
    it("setMask() - supply regex mask to ensure it populates $data.maskObj.regex", async () => {
      const mask = ['O[0-9]{4}-[0-9]{3}-[0-9]{3}-[0-9]{6}(.[0-9])?$']
      await wrapper.setProps({ 
        mask,
        isMaskRegex: true,
      })
      await wrapper.vm.setMask()
      expect(await wrapper.vm.$props.mask).toBe(mask)
      expect(await wrapper.vm.$data.maskObj.regex).toBe(mask[0]);
    })

    it("setMask() - supply empty regex mask to ensure it populates $data.maskObj ", 
      async () => {
        const mask = ['']
        await wrapper.setProps({ 
          isMaskRegex: true,
          mask
        })
        await wrapper.vm.setMask()
        expect(await wrapper.vm.$data.maskObj.regex).toBe(mask[0]);
      })

    it("setMask() - supply non-regex mask to ensure it populates $data.maskObj", 
      async () => {
        const mask = "word mask"
        await wrapper.setProps({ 
          isMaskRegex: false,
          mask
        })
        await wrapper.vm.setMask()
        expect(await wrapper.vm.$data.maskObj.mask).toBe(mask);
      })

  
  });

});
