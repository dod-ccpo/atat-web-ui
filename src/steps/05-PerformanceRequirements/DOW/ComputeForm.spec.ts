import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper, config} from "@vue/test-utils";
import ComputeForm from "../DOW/ComputeForm.vue";
import {DefaultProps} from "vue/types/options";
import validators from "../../../plugins/validation"

import { 
  Checkbox, 
  ComputeData,
  RadioButton,
  SelectData,
  ToastObj,
} from "../../../../types/Global";
Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ComputeForm, {
      localVue,
      vuetify,
      propsData:{
        
        computeData:{
          "instanceNumber": 1,
          "environmentType": "Dev/Testing",
          "classificationLevel": "1"
            "CONUS East"
          ],
          "deployedRegionsOther": "",
          "needOrUsageDescription": "sfsfsdfsad",
          "entireDuration": "NO",
          "periodsNeeded": [
            "1",
            "2"
          ],
          "operatingSystemAndLicensing": "safsfsdaf",
          "numberOfVCPUs": "1",
          "memory": "1",
          "storageType": "Provisioned IOPS SSD",
          "storageAmount": "1",
          "performanceTier": "Premium",
          "performanceTierOther": "",
          "numberOfInstancesNeeded": "1"
        }
      }
    });
  });

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  // describe("PROPS", () => { 
  //   it("label", async () => {
  //     wrapper.setProps({
  //       "label":"label Test"
  //     });
  //     await wrapper.vm.$nextTick();
  //     expect(wrapper.find("label").exists()).toBe(true);
  //   });
  // });

  // describe("EVENTS", () => { 
  //   it("onInput", async () => {
  //     const newVal = "newVal";
  //     await wrapper.vm.onInput(newVal);
  //     await wrapper.vm.$nextTick(()=>{
  //       expect(wrapper.emitted("update:value")?.flat()[0]).toMatch(newVal);
  //     });
  //   });

    // it("onBlur", async () => {
    //   const valOnBlur = "newVa";
    //   await wrapper.vm.onBlur(valOnBlur);
    //   await wrapper.vm.$nextTick(()=>{
    //     expect(wrapper.emitted("blur")?.flat()[0]).toMatch(valOnBlur);
    //   });
      
    // });
  // });
});
