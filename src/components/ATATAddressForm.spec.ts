import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATAddressForm from "@/components/ATATAddressForm.vue";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const addressTypeOptions = [
    {
      "id": "USAddress",
      "label": "U.S. address",
      "value": "US"
    },
    {
      "id": "MilitaryAddress",
      "label": "Military/Diplomatic (APO, FPO, or DPO)",
      "value": "MILITARY"
    },
    {
      "id": "ForeignAddress",
      "label": "Foreign address",
      "value": "FOREIGN"
    }
  ]

  const addressTypes = {
    "USA": "US",
    "MIL": "MILITARY",
    "FOR": "FOREIGN"
  }

  const requiredFields = [
  
    {
      "field": "City",
      "message": "Please enter a city."
    }
  ]

  const isValidRules = [
    {
      "field": "ZIPCode",
      "message": "Your ZIP code must be 5 or 9 digits.",
      "mask": [
        "99999",
        "99999-9999"
      ]
    },
    {
      "field": "PostalCode",
      "message": "Your postal code must be 10 characters or less & may include spaces and hyphens.",
      "mask": [
        "^[0-9A-Za-z\\s\\-]{1,10}$"
      ],
      "isMaskRegex": true
    }
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAddressForm, {
      vuetify,
      localVue,
      propsData:({
        addressTypeOptions,
        addressTypes,
      })
    });
  });

  describe("testing ATATAddressForm.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("addressTypeChange() - supplies addressType to set $props.selectedCountry ", 
      async ()=> {
        await wrapper.setProps({
          selectedAddressType: "US",
        });
        // const resetDataSpy = jest.spyOn(wrapper.vm, "resetData")
        await wrapper.vm.addressTypeChange("US");
        // expect(resetDataSpy).toHaveBeenCalled();
      }
    );

    it("getRules() - supply inputID to view invalid message ", async ()=>{
      await wrapper.setProps({
        requiredFields
      })
      const rulesArr = await wrapper.vm.getRules("City");
      expect(rulesArr[0]()).toBe('Please enter a city.')
    })

    it("getRules() - supply $props.isValidRules to return validation rules array " +
        "single valid item ", 
    async ()=>{
      await wrapper.setProps({
        requiredFields,
        isValidRules
      })
      const rulesArr = await wrapper.vm.getRules("PostalCode");
      expect(rulesArr[0]()).toBe(true)
    })

    it("setMask() - supply mask then ensure mask has been applied", 
      async ()=>{
        // stub in necessary ZIPCode textbox 
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "ZIPCode_text_field");
        document.body.appendChild(input);
       
        await wrapper.vm.setMask("ZIPCode", isValidRules[0]);
        expect(await  wrapper.vm.$data.maskObj.mask).toEqual(
          isValidRules[0].mask
        );
      })

    it("setMask() - supply regex mask then ensure mask w/regex has been applied", 
      async ()=>{
        // stub in necessary ZIPCode textbox 
        const input = document.createElement("input");
        input.setAttribute("type", "text");
        input.setAttribute("id", "ZIPCode_text_field");
        document.body.appendChild(input);
       
        await wrapper.vm.setMask("ZIPCode", isValidRules[1]);
        expect(await wrapper.vm.$data.maskObj.regex).toEqual(
          isValidRules[1].mask[0]
        );
      })

    it("inputClass() - setting $vuetify.breakpoint.mdAndDown to retrieve class", async ()=>{
      wrapper.vm.$vuetify.breakpoint.mdAndDown = true;
      const inputClass = await wrapper.vm.inputClass;
      expect(inputClass).toBe("_input-max-width my-2");
    })

    it("inputClass() - setting !$vuetify.breakpoint.mdAndDown to retrieve class", async ()=>{
      wrapper.vm.$vuetify.breakpoint.mdAndDown = false;
      const inputClass = await wrapper.vm.inputClass;
      expect(inputClass).toBe("my-2");
    })

    it("zipLabel() - setting selectedAddressType=`US` to retrieve class", async ()=>{
      await wrapper.setProps({
        selectedAddressType: "US"
      })
      const inputClass = await wrapper.vm.zipLabel;
      expect(inputClass).toBe("ZIP code");
    })

    it("zipLabel() - setting selectedAddressType=`US` to retrieve class", async ()=>{
      await wrapper.setProps({
        selectedAddressType: "FOREIGN"
      })
      const inputClass = await wrapper.vm.zipLabel;
      expect(inputClass).toBe("Postal code");
    })

    it("IDLabel() - setting selectedAddressType=`US` to retrieve class", async ()=>{
      await wrapper.setProps({
        selectedAddressType: "US"
      })
      const inputClass = await wrapper.vm.IDLabel;
      expect(inputClass).toBe("ZIPCode");
    })

    it("IDLabel() - setting selectedAddressType=`US` to retrieve class", async ()=>{
      await wrapper.setProps({
        selectedAddressType: "FOREIGN"
      })
      const inputClass = await wrapper.vm.IDLabel;
      expect(inputClass).toBe("PostalCode");
    })

  });


});
