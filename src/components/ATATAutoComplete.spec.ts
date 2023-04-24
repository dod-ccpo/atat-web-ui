import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import { AutoCompleteItem } from "types/Global";
import { DefaultProps } from "vue/types/options";
Vue.config.productionTip = false;
Vue.use(Vuetify);

describe("Testing ATATAutoComplete Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let autoComplete: Wrapper<DefaultProps & Vue, Element>;

  const items: AutoCompleteItem[] =  [
    {
      Id: 2,
      FullName: "Carl Contractingofficerep",
      Email: "carl.contractingofficerrep.civ@mail.mil",
      Phone: "555-555-5555",
      OrgName: "HQ1234 - Corresponding Organization Name"
    },
  ];

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAutoComplete, {
      localVue,
      vuetify,
      propsData: {
        searchFields: ['FullName']
      }
    });

    autoComplete = wrapper.find({ref: "atatAutoComplete"})
  });

  afterEach(()=>{
    jest.clearAllTimers();
  })
  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("inputClass() - sets $prop.icon===`search` to retrieve certain class Name", async()=> {
      await wrapper.setProps({
        icon: "search"
      })
      const _inputClass = await wrapper.vm.inputClass;
      expect(_inputClass).toBe("is-search-icon icon-no-rotate");
    })

    it("customFilter() - supply params that do return an data item", async () => {
      await wrapper.setProps({items})
      expect(await wrapper.vm.customFilter(items[0], "car")).toBe(true);
    });

    it("customFilter() - supply params that don't return an data item", async () => {
      await wrapper.setProps({items})
      expect(await wrapper.vm.customFilter(items[0], "zjr")).toBe(false);
    });

    it("noResultsAction() - call function to ensure $data is set", async () => {
      await wrapper.vm.noResultsAction();
      expect(await wrapper.vm.$data.searchText).toBeNull();
      expect(await wrapper.vm.$data.isReset).toBe(true);
    });

    it("setErrorMessage() - provides autoComplete.$data.errorBucket automatically to ensure " +
    "$data.errorMessage === autoComplete.$data.errorBucket ", async () => {
      jest.useFakeTimers();
      const errorMessages = ["error Message 001"]
      await autoComplete.setData({
        errorBucket: errorMessages
      })

      await wrapper.vm.setErrorMessage(); 
      jest.advanceTimersByTime(3000); 
      expect(await wrapper.vm.$data.errorMessages).toBe(errorMessages);
      
    })

    it("onBlur() - pass param to ensure param is emitted ", async () => {
      const value = "value";
      await wrapper.vm.onBlur(value);
      
      const emittedEvent = await wrapper.emitted("blur");
      expect(await emittedEvent?.flat()[0]).toBe(value);
    });

    it("onBlur() - pass param to ensure param is emitted ", async () => {
      const value = "value";
      await wrapper.vm.onBlur(value);
      
      const emittedEvent = await wrapper.emitted("blur");
      expect(await emittedEvent?.flat()[0]).toBe(value);
    });

 
    it("updateSearchInput() - set $data.isReset===true to ensure value is emitted", async () => {
      const isReset = true;
      await wrapper.setData({isReset: isReset});
      await wrapper.vm.updateSearchInput()
      
      const emittedEvent = await wrapper.emitted("autocompleteInputUpdate");
      expect(await emittedEvent?.flat()[0]).toBe(isReset);
    });

 
  })
});
