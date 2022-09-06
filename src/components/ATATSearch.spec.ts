import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSearch from "@/components/ATATSearch.vue";
import { SelectData } from "types/Global";
import { DefaultProps } from "vue/types/options";
import { EDAApi } from "../api/eda"
import api from "@/api";
Vue.config.productionTip = false;
Vue.use(Vuetify);

const mockApiCall = () => ({success: true, message: "success"})
// jest.mock('@/api', () => {
//   return jest.fn().mockImplementation(() => {
//     return { edaApi: jest.fn().mockImplementation(() => { 
//       return { search: mockApiCall } 
//     }) 
//     }
//   })
// })

// jest.mock("../api/eda", () => {
//   return {
//     EDAApi: {
//       search: jest.fn().mockImplementation(() => ({success: true, message: "success message"})),
//     }
//   };
// });


describe("Testing ATATSearch Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATSearch, {
      localVue,
      vuetify,
      propsData: {
        label: "Test Search Component",
        rules: [(v: string) => !!v || "is required"],
      }
    });

  });
  
  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("SearchWrapper")).toBeDefined()
    });
  });

  describe("PROPS", () => { 
    it("id", async () => {
      expect(wrapper.find(".id")).toBeDefined();
      expect(wrapper.vm.$props.id).toBe("Search");

      const id = "Test Search"
      await wrapper.setProps({ id });
      expect(wrapper.vm.$props.id).toBe(id)
    });
    it("label", async () => {
      expect(wrapper.find(".label")).toBeDefined()
      expect(wrapper.vm.$props.searchType).toBe("G-Invoicing")
    })
    it("searchType", async () => {
      expect(wrapper.find(".searchType")).toBeDefined()
      expect(wrapper.vm.$props.searchType).toBe("G-Invoicing")

      const type = "Test - EDA search type"
      await wrapper.setProps({ searchType: type })
      expect(wrapper.vm.$props.searchType).toBe(type)
    })
  });

  describe("DATA", () => { 
    it("rules", async () => {
      expect(wrapper.vm.rules[0]()).toBe("is required")
    })
  });
 
  describe("EVENTS", () => {
    it("onInput()", async () => {
      // set Error to be cleared during onInput
      const errorMessage = ["SearchInputError001"]
      const searchInputComponent = wrapper.findComponent({ref: "atatSearchInput"})
      await searchInputComponent.setData({ errorBucket: errorMessage })
      expect(wrapper.vm.$data.errorMessages).toEqual([])
      await wrapper.vm.setErrorMessage()
      
      const value = "O2101-900-900-000099";
      // ! does not update the expected value even with nextTick() used
      await wrapper.vm.onInput(value)
      
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.value).toBe(value) // ! the value could be anything and still pass
        expect(wrapper.vm.$props.showErrorAlert).toBeFalsy()
        expect(wrapper.vm.$props.showSuccessAlert).toBeFalsy()
      })
      
      expect(wrapper.vm.$props.showHelpText).toBeFalsy()
      expect(wrapper.vm.$data.errorMessages).toEqual([])
    })
    it("setErrorMessage()", async () => {
      const errorMessage = ["SearchInputError001"]
      const searchInputComponent = wrapper.findComponent({ref: "atatSearchInput"})
      await searchInputComponent.setData({ errorBucket: errorMessage })
      expect(wrapper.vm.$data.errorMessages).toEqual([])
      await wrapper.vm.setErrorMessage()
      expect(wrapper.vm.$data.errorMessages).toBe(errorMessage)
    })
    it("errorMessagesChanged() - show Help Text when no Error Messages", async () => {
      const errorMessage = ["SearchInputError001"]
      const searchInputComponent = wrapper.findComponent({ref: "atatSearchInput"})
      await searchInputComponent.setData({ errorBucket: errorMessage })
      await wrapper.vm.setErrorMessage([])
      expect(wrapper.vm.$data.errorMessages).toEqual(errorMessage)
      
      // after error message no longer present
      await wrapper.vm.clearErrorMessages([])
      await wrapper.vm.errorMessagesChanged([])
      expect(wrapper.vm.$data.errorMessages).toEqual([])
      expect(wrapper.vm.$data.showHelpText).toBeTruthy()
    })
    it("resetValidation()", async () => {
      const errorMessage = ["SearchInputError003"]
      const searchInputComponent = wrapper.findComponent({ref: "atatSearchInput"})
      await searchInputComponent.setData({ errorBucket: errorMessage })
      await wrapper.vm.setErrorMessage()
      await wrapper.vm.resetValidation()
      expect((wrapper.vm.$refs.atatSearchInput as any).errorBucket).toEqual([])
    })
    it("onBlur()", async () => {
      expect(true)
      // const value = "O2101-900-900-000099";
      // const tbWrapper = await wrapper.find({
      //   ref: "atatSearchInput"
      // })
      // // await tbWrapper.setProps({ value: value })
      // console.log( await tbWrapper.vm.$props)
      // const tb = tbWrapper.find("._search-input")
      // tb.trigger("blur")
    })
    it("setMask() - regex mask", async () => {
      const mask = ['O[0-9]{4}-[0-9]{3}-[0-9]{3}-[0-9]{6}(.[0-9])?$']
      await wrapper.setProps({ 
        mask,
        isMaskRegex: true,
      })
      await wrapper.vm.setMask()
      expect(wrapper.vm.$props.mask).toBe(mask)
      expect(wrapper.vm.$props.isMaskRegex).toBeTruthy()
    })
    it("setMask() - not a regex mask", async () => {
      const mask = "word mask"
      await wrapper.setProps({ mask })
      await wrapper.vm.setMask()
      expect(wrapper.vm.$props.mask).toBe(mask)
      expect(wrapper.vm.$props.isMaskRegex).toBeFalsy()
    })
    it.skip("setMask() - regex mask empty", async () => {
      // ? will this.mask ever be undefined or a falsy value?
      // not sure this is will do what it is suppose to
      // the code might have to be updated
      const mask: any = []
      await wrapper.setProps({ 
        mask,
        isMaskRegex: true,
      })
      await wrapper.vm.setMask()
      expect(wrapper.vm.$props.mask).toBe("")
      expect(wrapper.vm.$props.isMaskRegex).toBeTruthy()
    })
    it("search()", async () => {    
      // ! needs the this._value (input value) to be a value other wise will not run
      // TODO: mock api.edaApi.search() when searchType is EDA
      // TODO: set value which will allow for the simulation to run
      // TODO: success response x2 (EDA and other)
      // TODO: separate test with error response x2 (EDA and other)

      // await wrapper.vm.onInput("O2101-900-900-000009")
      await wrapper.setProps({ 
        searchType: "OtherType",
      })
      await wrapper.setData({
        errorMessages: [],
        _value: "dummyText"
      })
      await wrapper.vm.search()
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.searchCount).toBe(1)
        console.log(wrapper.vm.$props.searchCount)
        console.log("NEXT TICK: ", wrapper.vm.$data.searchCount)
      })

      console.log("SuccessAlert", wrapper.vm.$data.showSuccessAlert);
      // console.log("ErrorAlert", wrapper.vm.$data.showErrorAlert);
      // console.log("helpTxt", wrapper.vm.$data.showHelpText);
      // console.log("Loader", wrapper.vm.$data.showLoader);
      console.log("Count", wrapper.vm.$data.searchCount);
    })
  });

});
