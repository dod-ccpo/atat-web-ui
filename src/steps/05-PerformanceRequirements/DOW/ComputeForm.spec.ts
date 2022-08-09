import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import ComputeForm from "../DOW/ComputeForm.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";

import {
  Checkbox,
  RadioButton,
  SelectData,
} from "../../../../types/Global";
import DescriptionOfWork from "@/store/descriptionOfWork";
Vue.use(Vuetify);

describe("Testing ComputeForm Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  //propsData
  const computeData = {
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
    "numberOfInstancesNeeded": "1"
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
  ]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ComputeForm, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          DescriptionOfWork: {
            computeObject: computeData,
          }
        },

      },
      propsData: {
        computeData: computeData
      }
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
    })
  })

  describe("Method Testing...", () => {
    it("loadOnEnter() - is to set data.firstTimeHere to true ", async () => {
      wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.firstTimeHere).toBe(true);
    });

    it("@Watch errorBagChange() - sets data.formHasErrors when errors occur ", async () => {
      // set the initial data.errorBagValues
      wrapper.vm.$data.errorBagValues = [false, false];
      const computeForm = wrapper.findComponent({ ref: "computeForm" });
      computeForm.vm.$data.errorBag = { 810: true, 827: false }

      // change the data.errorBagValues value to activate data reactivity
      await wrapper.setData({
        errorBagValues: [true, false]
      })
      expect(await wrapper.vm.$data.formHasErrors).toBe(true);
    });

    it("createPeriodCheckboxItems() - tests that unsorted SNOW data is successfully " +
      "transformed to expected sorted datasource array for period checkbox items", async () => {
      const _createPeriodCheckboxItems = wrapper.vm.createPeriodCheckboxItems(
        [
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "OPTION",
            "option_order": "2",
            "sys_id": "period_02"
          },
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1",
            "sys_id": "period_01"

          },
        ]
      );
      expect(_createPeriodCheckboxItems).toEqual([
        {
          "id": "BASE",
          "label": "Base period",
          "value": "period_01"
        },
        {
          "id": "OPTION1",
          "label": "Option period 1",
          "value": "period_02"
        }
      ])
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
  })


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
  })

  describe("testing form fields", () => {
    describe("testing `entire duration` radio button selection", () => {
      it("tests `YES` being selected then clears prop.computeData.periodsNeeded[]", async () => {
        computeData.entireDuration = 'YES';
        await wrapper.setData({
          _computeData: computeData,
          availablePeriodCheckboxItems: [
            {
              id: "BaseDisabled",
              label: "Base period",
              value: "Base",
            }
          ]
        })
        Vue.nextTick(() => {
          expect(wrapper.vm.$props.computeData.periodsNeeded).toBe([]);
        })

      });

      it("tests `NO` being selected then sets prop.computeData.periodsNeeded[] to ['Base']",
        async () => {
          computeData.entireDuration = 'NO';
          await wrapper.setData({
            _computeData: computeData,
            availablePeriodCheckboxItems: [
              {
                id: "BaseDisabled",
                label: "Base period",
                value: "Base",
              }
            ]
          })
          Vue.nextTick(() => {
            expect(wrapper.vm.$props.computeData.periodsNeeded[0]).toBe(['Base']);
          })
        });
    });

    describe("Classification Label", () => {
      it("tests if expected verbiage mentions expected single classification level",
        async () => {
          await wrapper.setData({
            avlClassificationLevelObjects: [avlClassificationLevelObjects[0]]
          })
          await wrapper.vm.checkSingleClassification();
          const classLevelName = wrapper.vm.$data.singleClassificationLevelName;
          expect(classLevelName).toContain(
            wrapper.vm.$data.avlClassificationLevelObjects[0].impact_level
          );
        })
    });


    describe("Classification Modal Interactions", () => {
      it("tests if modal classification levels are changed `modalSelectedOptions` then " +
        "available Classification Levels `avlClassificationLevelObjects' are same " +
        "avlClassificationLevelObjects[] === modalSelectedOptions ", async () => {

        await wrapper.setData({
          allClassificationLevels: allClassificationLevels,
          modalSelectedOptions: ["class3", "class4"]
        })

        //closes modal and sets avlClassificationLevelObjects with 
        //class levels selected in modal
        await wrapper.vm.classificationLevelsChanged();

        //expects modal to be closed and data props to be set accordingly
        expect(wrapper.vm.$data.showDialog).toBe(false);
        expect(wrapper.vm.$data.avlClassificationLevelObjects.length).toEqual(2);

        // available class levels should be same as 
        // modal selected options
        Vue.nextTick(() => {
          expect(wrapper.vm.$data.avlClassificationLevelObjects).toEqual(
            wrapper.vm.$data.modalSelectedOptions
          )
        })
      })

      it("tests if only one option was selected in classification levels modal then" +
        "checkSingleClassification is to be called", async () => {

        await wrapper.setData({
          allClassificationLevels: allClassificationLevels,
          modalSelectedOptions: ["class3"]
        })

        //closes modal and sets avlClassificationLevelObjects with 
        //class levels selected in modal
        await wrapper.vm.classificationLevelsChanged();

        //expects modal to be closed and data props to be set accordingly
        expect(wrapper.vm.$data.showDialog).toBe(false);
        expect(wrapper.vm.$data.avlClassificationLevelObjects.length).toEqual(1);
      })

      it("tests if multiple classification levels were selected in modal and are not what " +
        "was originally selected reset computeForm.classificationLevels", async () => {
        computeData.classificationLevel = 'class3';
        await wrapper.setData({
          allClassificationLevels: allClassificationLevels,
          modalSelectedOptions: ["class4", "class5"]
        })

        //closes modal and sets avlClassificationLevelObjects with 
        //class levels selected in modal
        await wrapper.vm.classificationLevelsChanged();

        // if the classification level that was selected was removed via the modal,
        // reset computeData.classificationLevel
        Vue.nextTick(() => {
          expect(wrapper.vm.$props.computeData.classificationLevel).toBe("");
        })
      });
    });

    describe("Available Classification Levels Radio Group", () => {
      it("tests if no items are loaded, then classificationRadioOptions array has length===0",
        async () => {
          //set `avlClassificationLevelObjects` with data
          await wrapper.setData({
            avlClassificationLevelObjects: []
          })
          await wrapper.vm.setAvlClassificationLevels();

          // call `setAvlClassificationLevels` to transform data into 
          // radio button list
          Vue.nextTick(() => {
            // ensure radio button list is the same length as array
            expect(wrapper.vm.$data.classificationRadioOptions).toEqual(0);
          })
        });
      it("-tests if populated successfully from `avlClassificationLevelObjects` array then " +
        "classificationRadioOptions.length === avlClassificationLevelObjects.length",
      async () => {
        //set `avlClassificationLevelObjects` with data
        await wrapper.setData({
          avlClassificationLevelObjects: avlClassificationLevelObjects
        })
        await wrapper.vm.setAvlClassificationLevels();

        // call `setAvlClassificationLevels` to transform data into 
        // radio button list
        Vue.nextTick(() => {
          // ensure radio button list is the same length as array
          expect(wrapper.vm.$data.classificationRadioOptions).toHaveLength(
            avlClassificationLevelObjects.length
          );
        })
      });

    });

    describe("Validation Tests...", () => {
      describe("on page load and...", () => {
        it("validates if page has been 'touched', if so, expect validate() to be called",
          async () => {
            await wrapper.setData({
              formHasBeenTouched: true
            })

            await wrapper.vm.validate();
            Vue.nextTick(() => {
              const form = wrapper.vm.$data.Form;
              form.validate();
            })
          });

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
            computeData.performanceTier = "Premium";
            computeData.performanceTierOther = "";

            await wrapper.setData({
              _computeData: computeData,
              otherPerformanceTierValue: "Premium"
            })

            await wrapper.vm.setErrorMessages();

            Vue.nextTick(() => {
              expect(wrapper.vm.$data.validateOtherTierOnBlur).toBe(true);
              expect(wrapper.vm.$data.validateOtherTierNow).toBe(true);
            })
          });
          it("valid data", async () => {
            computeData.performanceTier = "Premium";
            computeData.performanceTierOther = "OtherValue";

            await wrapper.setData({
              _computeData: computeData,
              otherPerformanceTierValue: "Premium"
            })

            await wrapper.vm.setErrorMessages();

            Vue.nextTick(() => {
              expect(wrapper.vm.$data.validateOtherTierOnBlur).toBe(false);
              expect(wrapper.vm.$data.clearOtherTierValidation).toBe(true);
            })
          });
        });
        describe("tests validation on 'periodsCheckboxes(other option)' & " +
          "triggers error if ...", () => {
          it("no data, then expect data.errorMessages.toHaveLength(1)", async () => {
            computeData.entireDuration = "NO";
            computeData.periodsNeeded = [];

            await wrapper.setData({
              _computeData: computeData,
              availablePeriodCheckboxItems: availablePeriodCheckboxItems
            });

            await wrapper.vm.setErrorMessages();

            //updated wrapper.setData causes periodCheckboxList to display
            const periodCheckboxes = await wrapper.findComponent(
              { ref: "periodsCheckboxes" }
            );
            await periodCheckboxes.setData({
              prevSelected: []
            })
            expect(periodCheckboxes.exists()).toBe(true);
            expect(periodCheckboxes.vm.$data.errorMessages).toHaveLength(1);
          });
        });
        describe("tests validation on 'regionsCheckboxes(other option)' & " +
          "triggers error if ...", () => {
          it("no data, then region checkbox html will contain expected error", async () => {
            computeData.deployedRegions = ["OtherRegion"];
            computeData.deployedRegionsOther = "";

            await wrapper.setData({
              _computeData: computeData,
              otherRegionValue: "OtherRegion",
              regionCheckboxOptions: regionCheckboxOptions
            });

            await wrapper.vm.setErrorMessages();

            const regionCheckboxes = await wrapper.findComponent(
              { ref: "regionsCheckbox" }
            );
            expect(regionCheckboxes.exists()).toBe(true);
            expect(regionCheckboxes.html().trim()).toContain(
              "<div class=\"field-error ml-2\">Please enter your other region(s).</div>"
            );

          });
        });
      });

      describe("various form controls...", () => {
        it("testing OperatingSystemAndLicensing textbox 'required' rule with VALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.operatingSystemAndLicensing = "dummy text";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({ ref: "operatingSystemAndLicensing" });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBe(0);
        });

        it("testing OperatingSystemAndLicensing textbox 'required' rule with INVALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.operatingSystemAndLicensing = "";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({ ref: "operatingSystemAndLicensing" });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBeGreaterThan(0);
        });

        it("testing numberOfInstancesNeeded textbox 'required' rule with VALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.numberOfInstancesNeeded = "1";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "numberOfInstancesNeeded"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBe(0);
        });

        it("testing numberOfInstancesNeeded textbox 'required' rule with INVALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.numberOfInstancesNeeded = "";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "numberOfInstancesNeeded"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBeGreaterThan(0);
        });

        it("testing numberOfInstancesNeeded textbox 'greaterThanOrEqualTo1' rule " +
          "with VALID data, then setting data.errorMessages", async () => {
          computeData.numberOfInstancesNeeded = "1";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "numberOfInstancesNeeded"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBe(0);
        });

        it("testing numberOfInstancesNeeded textbox 'greaterThanOrEqualTo1' " +
          "rule with INVALID data, then setting data.errorMessages", async () => {
          computeData.numberOfInstancesNeeded = "0";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "numberOfInstancesNeeded"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBeGreaterThan(0);
        });
        it("testing storageAmount textbox 'required' rule with VALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.storageAmount = "10";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "storageAmount"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBe(0);
        });

        it("testing storageAmount textbox 'required' rule with INVALID data, " +
          "then setting data.errorMessages", async () => {
          computeData.storageAmount = "";
          await wrapper.setData({
            _computeData: computeData,
          });
          const textbox = await wrapper.findComponent({
            ref: "storageAmount"
          });
          expect(textbox.exists()).toBe(true);
          expect(textbox.vm.$data.errorMessages.length).toBeGreaterThan(0);
        });

      })

    });
  })
});
