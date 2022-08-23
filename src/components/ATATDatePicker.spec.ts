import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATDatePicker from "@/components/ATATDatePicker.vue";
import {DefaultProps} from "vue/types/options";

Vue.use(Vuetify);

describe("Testing ATATDatePicker Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    jest.useFakeTimers();
    wrapper = mount(ATATDatePicker, {
      localVue,
      vuetify,
      propsData:{
        id: "dp_test",
      }
    });
  });
  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(await wrapper.exists()).toBe(true);
    });
  })

  describe("testing", () => {
    it("@Watch `menu` data  -  activate Vue watcher by setting data.menu=true resulting " +
      "data.activePicker=DATE", async () => {
      await wrapper.setData({
        menu: true
      });

      jest.spyOn(global, 'setTimeout');
      expect(await wrapper.vm.$data.activePicker).toBe("DATE");
    });

    it("onBlur() sets data.dateFormatted value to be reformatted into  " +
      "vuetify datepicker expected format", async () => {
      wrapper.setData({
        dateFormatted: "01/02/2023"
      });
      await wrapper.vm.onBlur();
      expect(wrapper.vm.$data.date).toBe("2023-01-02");
    });

    it("onInput() sets data.date to '' to clear out other data properties", 
      async () => {
        await wrapper.vm.onInput("");
        expect(wrapper.vm.$data.dateFormatted).toBe("");
        expect(wrapper.vm.$data.date).toBe("");
        expect(wrapper.vm.$data.menu).toBe(false);
      }
    );

    it("datePickerClicked() - provides selectedDate to ensure  " +
     "menu.$data.original value === selectedDate", async()=>{
      await wrapper.vm.datePickerClicked("2022-02-02");
      const dpMenu = wrapper.findComponent({ref: "atatDatePickerMenu"});
      expect(dpMenu.vm.$data.originalValue).toBe("2022-02-02");
    });

    it("updateDateValueProperty() - set data.dateFormatted then test to ensure " +
      "data is emitted as expected", 
    async () => {
      const _dateFormatted = "01/02/2023";
      wrapper.setData({
        dateFormatted: _dateFormatted
      });
      await wrapper.vm.updateDateValueProperty();
 
      // assert event payload
      const emittedEvent = wrapper.emitted("update:value");
      expect(emittedEvent?.flat()[0]).toMatch(_dateFormatted);
    }
    );

    it("removeErrors() - set expected error data, call removeErrors to remove " +
       "all error data", 
    async () => {
      const _atatDatePicker = wrapper.findComponent({ ref: "atatDatePicker"});
      await _atatDatePicker.setData({
        errorBucket: ["error 001", "error 002"]
      })

      await wrapper.setData({
        errorMessages: ["error 001", "error 002"]
      })
      await wrapper.vm.removeErrors();

      // clear out all error data
      expect(_atatDatePicker.vm.$data.errorBucket).toHaveLength(0);
      expect(wrapper.vm.$data.errorMessages).toHaveLength(0);
    });

    it("reformatData() - sets formatted as yyyy-MM-dd if data isValid", async()=>{
      const reformattedDate = wrapper.vm.reformatDate("01/22/2023");
      expect(reformattedDate).toBe("2023-01-22");
    })

    it("toggleMenu() - sets data.menu to toggle menu", async()=>{
      const toggle = true;
      wrapper.setData({
        menu: true
      })
      await wrapper.vm.toggleMenu();
      expect(wrapper.vm.$data.menu).toBe(!toggle);
    });

    it("getMenutop() - sets menuTop to the bottom of the textbox to 40 " +
      "if no label is set", async()=>{
      wrapper.setData({
        label:""
      });
      expect(wrapper.vm.getMenutop).toBe("40")
    });

    it("getMenutop - sets menuTop to the bottom of the textbox to 80 " +
    "if label is set", async()=>{
      wrapper.setData({
        label:"Start Date"
      });
      expect(wrapper.vm.getMenutop).toBe("80")
    });

    it("setErrorMessages() - set valid error data, call removeErrors to remove " +
    "all error data", 
    async () => {
      const _atatDatePicker = wrapper.findComponent({ ref: "atatDatePicker"});
      await _atatDatePicker.setData({
        errorBucket: ["error 001", "error 002"]
      })
      await wrapper.vm.setErrorMessage();
      expect(wrapper.vm.$data.errorMessages).toHaveLength(2);
    });



  })


 
});
