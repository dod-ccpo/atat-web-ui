import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import ATATSearch from "@/components/ATATSearch.vue";
import { DefaultProps } from "vue/types/options";
import api from "@/api";
import PortfolioStore from "@/store/portfolio";
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
    search = wrapper.findComponent({ ref: "atatSearchInput" });
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe("testing ATATSearch", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find("SearchWrapper")).toBeDefined();
    });

    it("set rules props then ensure the select wrapper is equal to rules props", async () => {
      expect(await search.vm.$props.rules).toEqual([]);
    });

    it(
      "@Watch errorMessagesChanged() - change $data.errorMessages to [] to " +
        "display showHelpText when hideHelpTextOnErrors is true",
      async () => {
        await wrapper.setData({
          errorMessages: [],
          showLoader: false,
        });
        await wrapper.setProps({
          helpText: "wow",
          hideHelpTextOnErrors: true,
        });
        expect(wrapper.vm.showHelpText()).toBe(true);
      }
    );

    it(
      "@Watch errorMessagesChanged() - change $data.errorMessages to [] to " +
        "display showHelpText when hideHelpTextOnErrors is false",
      async () => {
        await wrapper.setData({
          errorMessages: [],
          showLoader: false,
        });
        await wrapper.setProps({
          helpText: "wow",
          hideHelpTextOnErrors: false,
        });
        expect(wrapper.vm.showHelpText()).toBe(true);
      }
    );

    it(
      "@Watch errorMessagesChanged() - populate $data.errorMessages to not display " +
        "showHelpText when hideHelpTextOnErrors is true",
      async () => {
        await wrapper.setData({
          errorMessages: ["error Message 001"],
          showLoader: true,
        });
        await wrapper.setProps({
          helpText: "wow",
          hideHelpTextOnErrors: true,
        });
        expect(wrapper.vm.showHelpText()).toBe(false);
      }
    );

    it(
      "@Watch errorMessagesChanged() - populate $data.errorMessages to display " +
        "showHelpText when hideHelpTextOnErrors is false",
      async () => {
        await wrapper.setData({
          errorMessages: ["error Message 001"],
          showLoader: true,
        });
        await wrapper.setProps({
          helpText: "wow",
          hideHelpTextOnErrors: false,
        });
        expect(wrapper.vm.showHelpText()).toBe(true);
      }
    );

    it(
      "onInput() - supply valid input with existing $data.errorMessages then  " +
        " ensure errorMessage has been cleared",
      async () => {
        const inputValue = "new inputted value";
        await wrapper.setData({
          errorMessages: ["error Message 001"],
        });
        await wrapper.vm.onInput(inputValue);
        Vue.nextTick(() => {
          // wrapper.vm.clearErrorMessages() has been called.
          expect(wrapper.vm.$data.errorMessages.length).toBe(0);
        });
      }
    );

    it(
      "onInput() - supply valid input with existing $data.errorMessages then  " +
        " ensure errorMessage has been cleared when this.isModal === true",
      async () => {
        const inputValue = "new inputted value";
        await wrapper.setData({
          errorMessages: ["error Message 001"],
        });
        await wrapper.setProps({
          isModal: true,
        })
        await wrapper.vm.onInput(inputValue);
        Vue.nextTick(() => {
          // wrapper.vm.clearErrorMessages() has been called.
          expect(wrapper.vm.$data.errorMessages.length).toBe(0);
        });
      }
    );

    it("onInput() - supply valid input then ensure $data.showHelpText===true", async () => {
      const inputValue = "new inputted value";
      await wrapper.vm.onInput(inputValue);
      Vue.nextTick(() => {
        expect(wrapper.vm.$props.value).toBe(inputValue);
        expect(wrapper.vm.$data.showHelpText).toBe(true);
      });
    });

    it("search() - $props.searchType !== `EDA` returns !$data.helpText", async () => {
      await wrapper.setProps({
        searchType: "OtherType",
        value: "dummyText",
      });
      await wrapper.vm.search();
      Vue.nextTick(() => {
        expect(wrapper.vm.$data.showHelpText).toBe(false);
      });
    });

    it(
      "search() - $props.searchType !== `EDA`, accommodates for setTimeout " +
        "returns !$data.showLoader",
      async () => {
        jest.useFakeTimers();
        await wrapper.setProps({
          searchType: "OtherType",
          value: "dummyText",
        });
        await wrapper.vm.search();
        //accommodate for setTimeout
        jest.advanceTimersByTime(3000);
        Vue.nextTick(() => {
          expect(wrapper.vm.$data.showLoader).toBe(false);
        });
      }
    );

    it(
      "setErrorMessage() - provides search.$data.errorBucket automatically to ensure " +
        "$data.errorMessage === search.$data.errorBucket ",
      async () => {
        const errorMessages = ["error Message 001"];
        await search.setData({
          errorBucket: errorMessages,
        });

        await wrapper.vm.setErrorMessage();
        Vue.nextTick(() => {
          expect(wrapper.vm.$data.errorMessages).toBe(errorMessages);
        });
      }
    );

    it(
      "setErrorMessage() - provides search.$data.errorBucket automatically to ensure " +
        "$data.errorMessage === search.$data.errorBucket when this.isModal === true",
      async () => {
        const errorMessages = ["error Message 001"];
        await search.setData({
          errorBucket: errorMessages,
        });
        await wrapper.setProps({
          isModal: true,
        })

        await wrapper.vm.setErrorMessage();
        Vue.nextTick(() => {
          expect(wrapper.vm.$data.errorMessages).toBe(errorMessages);
        });
      }
    );

    it(
      "intiateSearch() - properly triggers a search and sets trigger to false when theres a value",
      async () => {
        await wrapper.setProps({
          triggerSearch: true,
          value: 'test',
        })

        jest.spyOn(wrapper.vm, 'search').mockImplementation(() => { return Promise.resolve() })

        Vue.nextTick(() => {
          expect(wrapper.vm.$data._triggerSearch).toBe(false);
          expect(wrapper.vm.search).toHaveBeenCalled();
        });
      }
    );

    it(
      "intiateSearch() - properly triggers a search and sets trigger to false when theres no value",
      async () => {
        await wrapper.setProps({
          triggerSearch: true,
          value: '',
        })

        jest.spyOn(wrapper.vm, 'search').mockImplementation(() => { return Promise.resolve() })

        Vue.nextTick(() => {
          expect(wrapper.vm.$data._triggerSearch).toBe(false);
          expect(wrapper.vm.search).toHaveBeenCalled();
        });
      }
    );

    it(
      "resetValidationNowChange() - resets errors when set as a prop to true",
      async () => {
        const errorMessages = ["error Message 001"];
        await wrapper.setProps({
          resetValidationNow: true,
        })
        await wrapper.setData({
          errorMessages,
        })

        Vue.nextTick(() => {
          expect(wrapper.vm.$data.errorMessages).toEqual([]);
        });
      }
    );

    it(
      "search() - errors on this.searchType === 'EDA' with bad API response",
      async () => {
        await wrapper.setProps({
          searchType: "EDA",
        })

        jest.spyOn(api.edaApi, 'search').mockImplementation(() => { throw Error })

        try {
          wrapper.vm.search();
        } catch {
          expect(wrapper.vm.$data.showErrorAlert).toBe(true)
        }
      }
    );

    it(
      "search() - success on this.searchType === 'EDA' with good API response",
      async () => {
        await wrapper.setProps({
          searchType: "EDA",
        })

        jest.spyOn(api.edaApi, 'search').mockImplementation(() => Promise.resolve({
          success: true,
        }))
        jest.spyOn(PortfolioStore, 'initProvisioningFromResponse')
          .mockImplementation(() => Promise.resolve())

        try { 
          wrapper.vm.search();
        } catch {
          expect(wrapper.vm.$data.showErrorAlert).toBe(false)
        }
      }
    );

    it(
      "search() - errors on this.searchType === 'G-Invoicing' && GtcNumber with bad API response",
      async () => {
        await wrapper.setProps({
          searchType: "G-Invoicing",
          gInvoicingSearchType: "GtcNumber",
        })

        jest.spyOn(api.gInvoicingApi, 'searchGtc').mockImplementation(() => { throw Error })

        try {
          wrapper.vm.search();
        } catch {
          expect(wrapper.vm.$data.showErrorAlert).toBe(true)
        }
      }
    );

    it(
      "search() - errors on this.searchType === 'G-Invoicing' && OrderNumber with bad API response",
      async () => {
        await wrapper.setProps({
          searchType: "G-Invoicing",
          gInvoicingSearchType: "OrderNumber",
        })

        jest.spyOn(api.gInvoicingApi, 'searchOrder').mockImplementation(() => { throw Error })

        try {
          wrapper.vm.search();
        } catch {
          expect(wrapper.vm.$data.showErrorAlert).toBe(true)
        }
      }
    );

    it("onBlur() - call event and ensure `blur` event is emitted with $props.value ", async () => {
      const value = "new input value";
      await wrapper.setProps({
        value,
      });
      const tb = wrapper.find("input");
      await tb.trigger("blur");
      expect(await wrapper.emitted("blur")?.flat()[0]).toBe(value);
    });

    it(
      "resetValidation() - supply $data.errorMessage[] and ensure v-text-field " +
        "errorBucket for atatSearchInput gets cleared when NOT modal",
      async () => {
        const errorMessage = ["error Message 001"];
        await wrapper.setData({
          errorMessage,
        });
        await wrapper.setProps({
          isModal: false,
        });
        await wrapper.vm.resetValidation();
        expect(search.vm.$data.errorBucket).toEqual([]);
      }
    );

    it(
      "resetValidation() - supply $data.errorMessage[] and ensure v-text-field " +
        "errorBucket for atatSearchInputModal gets cleared when IS modal",
      async () => {
        const errorMessage = ["error Message 001"];
        await wrapper.setData({
          errorMessage,
        });
        await wrapper.setProps({
          isModal: true,
        });
        await wrapper.vm.resetValidation();
        expect(search.vm.$data.errorBucket).toEqual([]);
      }
    );

    it("setMask() - supply regex mask to ensure it populates $data.maskObj.regex", async () => {
      const mask = ["O[0-9]{4}-[0-9]{3}-[0-9]{3}-[0-9]{6}(.[0-9])?$"];
      await wrapper.setProps({
        mask,
        isMaskRegex: true,
      });
      await wrapper.vm.setMask();
      expect(await wrapper.vm.$props.mask).toBe(mask);
      expect(await wrapper.vm.$data.maskObj.regex).toBe(mask[0]);
    });

    it("setMask() - supply empty regex mask to ensure it populates $data.maskObj ", async () => {
      const mask = [""];
      await wrapper.setProps({
        isMaskRegex: true,
        mask,
      });
      await wrapper.vm.setMask();
      expect(await wrapper.vm.$data.maskObj.regex).toBe(mask[0]);
    });

    it("setMask() - supply non-regex mask to ensure it populates $data.maskObj", async () => {
      const mask = "word mask";
      await wrapper.setProps({
        isMaskRegex: false,
        mask,
      });
      await wrapper.vm.setMask();
      expect(await wrapper.vm.$data.maskObj.mask).toBe(mask);
    });

  });
});
