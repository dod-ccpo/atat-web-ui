import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper, config} from "@vue/test-utils";
import ComputeForm from "../DOW/ComputeForm.vue";
import {DefaultProps} from "vue/types/options";
import validators from "../../../plugins/validation";

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
  config.showDeprecationWarnings = false
  Vue.config.silent = true;
  
  //propsData
  const computeData = {
    "instanceNumber": 1,
    "environmentType": "Dev/Testing",
    // `pragma: allowlist secret`
    "classificationLevel": "1", 
    "deployedRegions": [
      "CONUS East"
    ],
    "deployedRegionsOther": "",
    "needOrUsageDescription": "sfsfsdfsad",
    "entireDuration": "",
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
  
  const avlClassificationLevelObjects = [
    {
      "sys_id": "1",
      "sys_updated_by": "person1-ctr@ccpo.mil",
      "sys_created_on": "2022-05-12 17:24:35",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "sys_updated_on": "2022-05-12 17:24:35",
      "classification": "S",
      "sys_tags": "",
      "sys_created_by": "person1-ctr@ccpo.mil"
    },
    {
      "sys_id": "cc3b52af87970590ec3b777acebb3581",
      "sys_updated_by": "person1-ctr@ccpo.mil",
      "sys_created_on": "2022-05-12 17:24:04",
      "sys_mod_count": "0",
      "impact_level": "IL2",
      "sys_updated_on": "2022-05-12 17:24:04",
      "classification": "U",
      "sys_tags": "",
      "sys_created_by": "person1-ctr@ccpo.mil"
    }
  ]

  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ComputeForm, {
      localVue,
      vuetify,
      propsData:{
        computeData: computeData
      }
    });
    jest.spyOn(console, 'error');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore jest.spyOn adds this functionality
    console.error.mockImplementation(() => null);
  });

  describe("INITIALIZATION", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });


  describe("testing entire duration radio button selection", () => { 
    it("- selecting `YES` remove POP entries", async () => {
      computeData.entireDuration = 'YES';
      await wrapper.setData({
        _computeData: computeData,
        availablePeriodCheckboxItems:[
          {
            id: "BaseDisabled",
            label: "Base period",
            value: "Base",
          }
        ]
      })
      Vue.nextTick(()=>{
        expect(wrapper.vm.$props.computeData.periodsNeeded[0]).toBe([]);
      })

    });

    it("- selecting `NO` preselect BASE period", async () => {
      computeData.entireDuration = 'NO';
      await wrapper.setData({
        _computeData: computeData,
        availablePeriodCheckboxItems:[
          {
            id: "BaseDisabled",
            label: "Base period",
            value: "Base",
          }
        ]
      })
      Vue.nextTick(()=>{
        expect(wrapper.vm.$props.computeData.periodsNeeded[0]).toBe(['Base']);
      })
    });
  });

  describe("testing modal functionality", () => {
    it("- modal successfully opens", async () => {
      expect(wrapper.vm.$data.showDialog).toBe(false);
      const spy = await jest.spyOn(wrapper.vm, "openModal");
      await wrapper.vm.openModal();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.vm.$data.showDialog).toBe(true);
    });
    it("- modal is not open", async () => {
      expect(wrapper.vm.$data.showDialog).toBe(false);
    });
    it("- modal successfully closes", async () => {
      expect(wrapper.vm.$data.showDialog).toBe(false);
      await wrapper.setData({
        showDialog: true
      })
      const spy = await jest.spyOn(wrapper.vm, "modalCancelClicked");
      await wrapper.vm.modalCancelClicked();
      expect(spy).toHaveBeenCalled();
      expect(wrapper.vm.$data.showDialog).toBe(false);
    });
  })

  describe("testing form fields", () => {
    describe("Classification Label", ()=>{
      it("tests if verbiage is accurate for single classification level", async ()=>{
        await wrapper.setData({
          avlClassificationLevelObjects: [avlClassificationLevelObjects[0]]
        })
        const spy = await jest.spyOn(wrapper.vm, "checkSingleClassification");
        await wrapper.vm.checkSingleClassification();
        expect(spy).toHaveBeenCalled();
        const classLevelName = wrapper.vm.$data.singleClassificationLevelName;
        expect(classLevelName).toContain(
          wrapper.vm.$data.avlClassificationLevelObjects[0].impact_level
        )
      })
    });

    describe("Classification Modal Interactions", ()=>{
      it("tests if classification levels change", async ()=>{
        await wrapper.setData({
          avlClassificationLevelObjects: [avlClassificationLevelObjects[0]]
        })
        const spy = await jest.spyOn(wrapper.vm, "checkSingleClassification");
        await wrapper.vm.checkSingleClassification();
        expect(spy).toHaveBeenCalled();
        const classLevelName = wrapper.vm.$data.singleClassificationLevelName;
        expect(classLevelName).toContain(
          wrapper.vm.$data.avlClassificationLevelObjects[0].impact_level
        )
      })
    });
    
    describe("Available Classification Levels Radio Group", ()=>{
      it("- tests if no items are in `avlClassificationLevelObjects` array ", async () => {
        //set `avlClassificationLevelObjects` with data
        await wrapper.setData({
          avlClassificationLevelObjects: []
        })
        const spy = await jest.spyOn(wrapper.vm, "setAvlClassificationLevels");
        await wrapper.vm.setAvlClassificationLevels();
  
        // call `setAvlClassificationLevels` to transform data into 
        // radio button list
        expect(spy).toHaveBeenCalled();
        Vue.nextTick(()=>{
          // ensure radio button list is the same length as array
          expect(wrapper.vm.$data.classificationRadioOptions).toEqual(0);
        })
      });
      it("- tests if populated successfully from `avlClassificationLevelObjects` array ", async () => {
        //set `avlClassificationLevelObjects` with data
        await wrapper.setData({
          avlClassificationLevelObjects: avlClassificationLevelObjects
        })
        const spy = await jest.spyOn(wrapper.vm, "setAvlClassificationLevels");
        await wrapper.vm.setAvlClassificationLevels();

        // call `setAvlClassificationLevels` to transform data into 
        // radio button list
        expect(spy).toHaveBeenCalled();
        Vue.nextTick(()=>{
          // ensure radio button list is the same length as array
          expect(wrapper.vm.$data.classificationRadioOptions).toHaveLength(
            avlClassificationLevelObjects.length
          );
        })
      });
      
    });
   
  })




});
