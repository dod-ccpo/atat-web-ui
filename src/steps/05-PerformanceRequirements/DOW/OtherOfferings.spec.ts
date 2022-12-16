import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import OtherOfferings from "../DOW/OtherOfferings.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";

import {
  Checkbox,
  RadioButton,
  SelectData,
} from "../../../../types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
Vue.use(Vuetify);

describe("Testing OtherOfferings Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  //propsData
  const serviceOfferingData = {
    "instanceNumber": 1,
    "environmentType": "Dev/Testing",
    // `pragma: allowlist secret`
    "classificationLevel": "class1",
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
    "numberOfInstances": "1"
  }

  const avlClassificationLevelObjects = [
    {
      "sys_id": "1",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "classification": "S",
    },
    {
      "sys_id": "cc3b52af87970590ec3b777acebb3581",
      "sys_mod_count": "0",
      "impact_level": "IL2",
      "classification": "U",
    }
  ]

  const allClassificationLevels = [
    {
      "sys_id": "class1",
      "sys_mod_count": "0",
      "impact_level": "IL4",
      "classification": "U",
    },
    {
      "sys_id": "class2",
      "sys_mod_count": "0",
      "impact_level": "",
      "classification": "TS",
    },
    {
      "sys_id": "class3",
      "sys_mod_count": "0",
      "impact_level": "IL6",
      "classification": "S",
    },
    {
      "sys_id": "class4",
      "sys_mod_count": "0",
      "impact_level": "IL2",
      "classification": "U",
    },
    {
      "sys_id": "class5",
      "sys_mod_count": "0",
      "impact_level": "IL5",
      "classification": "U",
    }
  ]

  const availablePeriodCheckboxItems = [
    {
      "id": "BASE",
      "label": "Base period",
      "value": "base_01"
    },
    {
      "id": "OPTION1",
      "label": "Option period 1",
      "value": "option_01"
    }
  ]

  const regionCheckboxOptions = [
    {
      id: "CONUSEast",
      label: "CONUS East",
      value: "CONUS East",
    },
    {
      id: "CONUSCentral",
      label: "CONUS Central",
      value: "CONUS Central",
    },
    {
      id: "CONUSWest",
      label: "CONUS West",
      value: "CONUS West",
    },
    {
      id: "OCONUS",
      label: "OCONUS",
      value: "OCONUS",
    },
    {
      id: "Other",
      label: "Other",
      value: "OtherRegion",
    }];

  const periodDTO = [
    [
      {
        "period_unit": "YEAR",
        "period_unit_count": "1",
        "period_type": "BASE",
        "option_order": "1"
      },
      {
        "period_unit": "YEAR",
        "period_unit_count": "1",
        "period_type": "BASE",
        "option_order": "2"
      },
      {
        "period_unit": "YEAR",
        "period_unit_count": "1",
        "period_type": "BASE",
        "option_order": "3"
      }
    ]
  ];

  const classificationRadioOptions: RadioButton[] = [
    { id: "Option1", label: "label1", value: "IL1" },
    { id: "Option2", label: "label2", value: "IL2" },
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(OtherOfferings, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          DescriptionOfWork: {
            otherOfferingObject: {
              otherOfferingData: [serviceOfferingData]
            } ,
            otherOfferingInstancesTouched: [],
          },
          Periods: {
            periods: periodDTO,
            initialized: true,
          },
          ClassificationRequirements: {
            selectedClassificationLevels: avlClassificationLevelObjects,
          }
        },

      },
      propsData: {
        serviceOfferingData: serviceOfferingData,
        isCompute: true,
        isGeneral: false,
        isPeriodsDataMissing: false,
        isClassificationDataMissing: false,
        availablePeriodCheckboxItems: availablePeriodCheckboxItems,
        firstTimeHere: false,
      },
    });
  });


  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Vue Lifecyle Hook Testing...", () => {
    it("should set formHasBeenTouched to false when mounted", () => {
      expect(wrapper.vm.$data.formHasBeenTouched).toBe(false);
    });
  })

  describe("Method Testing...", () => {
    it("Compute: loadOnEnter() - is to set data.firstTimeHere to true ", async () => {
      wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.firstTimeHere).toBe(true);
    });

    it(`Compute: loadOnEnter() - determines not to validate form on load`, async () => {
      await wrapper.vm.loadOnEnter();
      expect(await wrapper.vm.$data.formHasBeenTouched).toBe(false);
      expect(await wrapper.vm.$data.validateOtherTierOnBlur).toBe(true);
    });

    it(`Compute: loadOnEnter() - sets boolean formHasBeenTouched to true
      to trigger validation when returning to edit existing compute instance`, async () => {
      DescriptionOfWork.setCurrentOfferingGroupId("compute");
      await DescriptionOfWork.pushTouchedOtherOfferingInstance(1);
      await wrapper.vm.loadOnEnter();
      console.log("data", await wrapper.vm.$props.serviceOfferingData.instanceNumber)
      expect(await wrapper.vm.$data.formHasBeenTouched).toBe(true);
    });

    it("GeneralXaaS: loadOnEnter() - is to set data.firstTimeHere to true ", async () => {
      await wrapper.setData({
        isCompute: false,
        isGeneral: true,
      });
      wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.firstTimeHere).toBe(true);
    });

    it("@Watch errorBagChange() - sets data.formHasErrors when errors occur ", async () => {
      // set the initial data.errorBagValues
      wrapper.vm.$data.errorBagValues = [false, false];
      const computeForm = wrapper.findComponent({ ref: "serviceOfferingForm" });
      computeForm.vm.$data.errorBag = { 810: true, 827: false }

      // change the data.errorBagValues value to activate data reactivity
      await wrapper.setData({
        errorBagValues: [true, false]
      })
      expect(await wrapper.vm.$data.formHasErrors).toBe(true);
    });

    it("createCheckboxOrRadioItems() - tests that SNOW data is successfully transformed to " +
      "expected datasource array for checkbox or radio items", async () => {
      // creates array to be used for Checkbox/RadioList datasource
      const _createCheckboxOrRadioItems = wrapper.vm.createCheckboxOrRadioItems(
        allClassificationLevels,
        "Radio"
      );
        // ensures one Checkbox/RadioList object in datasource is crafted correctly
      expect(_createCheckboxOrRadioItems.filter((rdoItem: Checkbox) => {
        return rdoItem.value === 'class1' &&
            rdoItem.label === 'Unclassified / Impact Level 4 (IL4)'
      })).toHaveLength(1);
    });

    it("ensures setAvlClassificationLevels() method generates radio options", async () => {
      await wrapper.setData({
        avlClassificationLevelObjects,
      });
      wrapper.vm.setAvlClassificationLevels();
      expect(wrapper.vm.classificationRadioOptions.length).toEqual(2);
    });

    it(`ensures checkSingleClassification() sets a short classification level label
      if only one available classification level`, async () => {
      await wrapper.setData({
        avlClassificationLevelObjects: [avlClassificationLevelObjects[0]]
      })
      await wrapper.vm.checkSingleClassification();
      const classLevelName = wrapper.vm.$data.singleClassificationLevelName;
      expect(classLevelName).toContain(
        wrapper.vm.$data.avlClassificationLevelObjects[0].impact_level
      );
    });

    it(`ensures classificationLevelsChanged(), multiple available`, async () => {
      await wrapper.setData({
        showDialog: false,
        avlClassificationLevelObjects:[
          {
            "sys_id": "class1",
            "sys_mod_count": "0",
            "impact_level": "IL4",
            "classification": "U",
          },
        ],
        modalSelectedOptions: ["class1", "class2"],
        allClassificationLevels: [
          {
            "sys_id": "class1",
            "sys_mod_count": "0",
            "impact_level": "IL4",
            "classification": "U",
          },
          {
            "sys_id": "class2",
            "sys_mod_count": "0",
            "impact_level": "",
            "classification": "TS",
          },
        ]
      });
      await wrapper.vm.classificationLevelsChanged();
      expect(wrapper.vm.showDialog).toBe(false);
    });

    it(`ensures classificationLevelsChanged(), single available`, async () => {
      await wrapper.setData({
        showDialog: false,
        avlClassificationLevelObjects:[
          {
            "sys_id": "class1",
            "sys_mod_count": "0",
            "impact_level": "IL4",
            "classification": "U",
          },
        ],
        modalSelectedOptions: ["class1", "class2"],
        allClassificationLevels: [
          {
            "sys_id": "class1",
            "sys_mod_count": "0",
            "impact_level": "IL4",
            "classification": "U",
          },
        ]
      });
      await wrapper.vm.classificationLevelsChanged();
      expect(wrapper.vm.showDialog).toBe(false);
    });

  });

  describe("testing modal functionality...", () => {
    it("if model opens, set data.showDialog=true", async () => {
      await wrapper.vm.openModal();
      expect(wrapper.vm.$data.showDialog).toBe(true);
    });
    it("if modal closes, call necessary functions and set data.showDialog=false", async () => {
      await wrapper.setData({
        showDialog: true
      })
      await wrapper.vm.modalCancelClicked();
      expect(wrapper.vm.$data.showDialog).toBe(false);
    });
  });

  describe("Validation Tests...", () => {
    describe("on page load and...", () => {
      it("validates if page has been 'touched', if so, expect validate() to be called",
        async () => {
          await wrapper.setData({
            formHasBeenTouched: true
          });
          
          await wrapper.vm.validate();
          Vue.nextTick(() => {
            const form = wrapper.vm.$data.Form;
            form.validate();
          })
        }
      );

      it("does not validate if page has NOT been 'touched', expect " +
        "data.validateOtherTierOnBlur to be true", async () => {
        await wrapper.setData({
          formHasBeenTouched: false
        })
        Vue.nextTick(() => {
          expect(wrapper.vm.$data.validateOtherTierOnBlur).toBe(true);
        })
      });

      describe("validates `performanceTier` radio group 'other' textbox with ...", () => {

        it("if invalid data, expect data.validateOtherTierOnBlur and  " +
          "data.validateOtherTierNow to be true", async () => {
          serviceOfferingData.performanceTier = "Premium";
          serviceOfferingData.performanceTierOther = "";

          await wrapper.setData({
            _serviceOfferingData: serviceOfferingData,
            otherPerformanceTierValue: "Premium"
          });

          await wrapper.vm.setErrorMessages();

          Vue.nextTick(() => {
            expect(wrapper.vm.$data.validateOtherTierOnBlur).toBe(true);
            expect(wrapper.vm.$data.validateOtherTierNow).toBe(true);
          })
        });


        it("valid data", async () => {
          serviceOfferingData.performanceTier = "Premium";
          serviceOfferingData.performanceTierOther = "OtherValue";

          await wrapper.setData({
            _serviceOfferingData: serviceOfferingData,
            otherPerformanceTierValue: "Premium"
          })

          await wrapper.vm.setErrorMessages();

          Vue.nextTick(() => {
            expect(wrapper.vm.$data.validateOtherTierOnBlur).toBe(false);
            expect(wrapper.vm.$data.clearOtherTierValidation).toBe(true);
          })
        });
      });

      
    });


  });

});
