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

  afterEach(()=>{
    jest.clearAllTimers();
  })

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
    
    it("@Watch validateCheckboxesNow - set $props.rules to ensure " +
          "$data.checkboxRules === $props.rules", async ()=> {
      await wrapper.setProps({rules})
      wrapper.vm.$data.validateCheckboxesNow = true;
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

    it("@Watch `selected` -  if `NONE` is checked, uncheck previous selections", async()=>{
      const _noneValue = "NONE"
      await wrapper.setProps({
        value: ["1","2"]
      })
      wrapper.vm.$props.value = [_noneValue],
      expect(await wrapper.vm.$props.value[0]).toBe(_noneValue)
    })

    it("@Watch `selected` -  if multiple items are checked including `NONE`, " +
      "uncheck previous selections except for `NONE`", async()=>{
      const _noneValue = "NONE"
      await wrapper.setProps({
        value: ["1", _noneValue]
      })
      wrapper.vm.$props.value = [_noneValue],
      expect(await wrapper.vm.$props.value[0]).toBe(_noneValue)
    })


    it("@Watch `selected` -  if multiple items were prechecked including `NONE`, " +
    "only new checked items will be saved, and not NONE`", async()=>{
      const _noneValue = "NONE";
      const _newValue = "2";
      await wrapper.setProps({
        value: ["1",_noneValue]
      });
      await wrapper.setData({
        prevSelected: ["1",_noneValue]
      })
      wrapper.vm.$props.value = [_newValue, _noneValue],
      expect(await wrapper.vm.$props.value).toEqual([_newValue]);
    })

    it("checkboxClicked - zero checkbox rules ensures checkboxes are validated", async()=>{
      await wrapper.vm.checkBoxClicked("1");
      expect(await wrapper.vm.validateCheckboxesNow).toBe(true);
    })

    it("checkboxClicked() - check `other` checkbox, then check `NONE`, and `other` " +
        "elements are to disappear", async()=>{
      const _noneValue = "NONE";
      const _otherValue= "OTHER";
      await wrapper.setProps({
        prevSelected: [],
        otherValue: _otherValue,
        value: [_otherValue],
     
      });
      wrapper.vm.checkBoxClicked(_noneValue);

      // remove `Other` validation and textField/textarea from form
      expect(wrapper.vm.$data.validateOtherOnBlur).toBe(false);
      expect(wrapper.vm.$data.hideOtherTextarea).toBe(true)
    })

    it("checkboxClicked() - selecting items after `Other` does not trigger `Other` " +
      "textField/textArea validation", async()=>{
      const _otherValue= "OTHER";
      await wrapper.setProps({
        prevSelected: [],
        otherValue: _otherValue,
        value: [_otherValue],
 
      });
      await wrapper.vm.checkBoxClicked(_otherValue);
      expect(wrapper.vm.$data.validateOtherOnBlur).toBe(false);
    })

    it("checkboxClicked() - selecting `Other` initially and successfully initializing " +
      "validation on respective textField/textArea field", async()=>{
      const _otherValue= "OTHER";
      await wrapper.setProps({
        prevSelected: [],
        otherValue: _otherValue,
        value: [],
 
      });
      await wrapper.vm.checkBoxClicked(_otherValue);
      expect(wrapper.vm.$data.validateOtherOnBlur).toBe(true);
    })

    it("setErrorMessage() - setting valid values to remove errorMessages", async ()=>{
      await wrapper.setProps({
        prevSelected: [],
        value: ["1","2"],
      });
      await wrapper.setData({
        errorMessages: ["error Message 001", "error Message 002"]
      })
      await wrapper.vm.setErrorMessage();
      expect(await wrapper.vm.$data.errorMessages).toHaveLength(0)
    })

    it("setErrorMessage() - setting blank values to successfully trigger " +
      "vuetify checkbox error messages", async ()=>{
      jest.useFakeTimers()
      const _errorMessages = ["error Message 001", "error Message 002"]
      await wrapper.setProps({
        prevSelected: [],
        value: [],
        rules
      });
      await wrapper.setData({
        errorMessages: []
      })

      const checkboxes = wrapper.find({ ref: "checkboxGroup"});
      checkboxes.setData({
        errorBucket: _errorMessages
      })

      await wrapper.vm.setErrorMessage();
      jest.advanceTimersByTime(1000);
      expect(await wrapper.vm.$data.errorMessages).toEqual(_errorMessages);
    })


    it("@Watch items - supply new item set to ensure blur event " +
      "listeners have been added", async ()=>{
      wrapper.vm.$props.items=[
        {
          id: "CheckboxOne",
          label: "CheckboxOne",
          value: "1",
        }
      ]
      const _setEventListeners = jest.spyOn(wrapper.vm, "setEventListeners")
      Vue.nextTick(()=>{
        Vue.nextTick(()=>{
          expect(_setEventListeners).toHaveBeenCalled()
        });
      });
    })

    it("setCheckboxEventListeners() - stub in 2 checkboxes, " +
      "add blur event listeners, dispatch blur event, to ensure " +
      "$data.blurredCheckboxes[] contains id of blurred checkbox", async ()=>{

      await wrapper.setData({
        id: "CB",
        validateCheckboxesNow: false
      })

      const cb01 = document.createElement("input");
      cb01.setAttribute("type", "checkbox");
      cb01.setAttribute("id", "Checkbox_CheckboxOne");
      cb01.setAttribute("data-group-id", "CB_Group")

      const cb02 = document.createElement("input");
      cb02.setAttribute("type", "checkbox");
      cb02.setAttribute("id", "Checkbox_CheckboxTwo");
      cb02.setAttribute("data-group-id", "CB_Group")

      await document.body.appendChild(cb01);
      await document.body.appendChild(cb02);
      await wrapper.vm.setEventListeners();
      await cb02.dispatchEvent(new FocusEvent("blur"));

      expect(await wrapper.vm.$data.blurredCheckboxes.CB_Group[0]).toBe(
        "Checkbox_CheckboxTwo"
      )
    
    })
  
  })

});


