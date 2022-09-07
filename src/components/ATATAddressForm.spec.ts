import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATAddressForm from "@/components/ATATAddressForm.vue";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let addressTypeRadioButtons: Wrapper<DefaultProps & Vue, Element>;

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

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAddressForm, {
      vuetify,
      localVue,
      propsData:({
        addressTypeOptions,
        addressTypes
      })
    });
    addressTypeRadioButtons = wrapper.find({ref: "addressType"});
  });

  describe("INITIALIZATION", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("addressTypeChange() - supplies addressType to set $props.selectedCountry ", 
      async ()=> {
        await wrapper.setProps({
          selectedAddressType: "US",
        });
        await wrapper.vm.addressTypeChange("US");
        
        // const radioButton = await addressTypeRadioButtons.find("input#Radio_USAddress");
        // await radioButton.trigger("radioButtonSelected");
        // await addressTypeRadioButtons.trigger("radioButtonSelected");
        console.log(await wrapper.vm.$props.selectedCountry.text);
        Vue.nextTick(()=>{
          // 
          // console.log(radioButton.html())
          // console.log(wrapper.vm.$props.selectedCountry);
        })
        
      })

  });


});
