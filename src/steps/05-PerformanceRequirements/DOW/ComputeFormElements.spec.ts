import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import ComputeFormElements from "./ComputeFormElements.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";

import {
  Checkbox,
  RadioButton,
  SelectData,
  OtherServiceOfferingData
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
  const otherOfferingData: OtherServiceOfferingData  = {
    "instanceNumber": 1,
    "environmentType": "Dev/Testing",
    // `pragma: allowlist secret`
    "classificationLevel": "class1",
    "deployedRegions": [
      "CONUS East"
    ],
    "deployedRegionsOther": "",
    "descriptionOfNeed": "sfsfsdfsad",
    "entireDuration": "",
    "periodsNeeded": [
      "1",
      "2"
    ],
    "operatingSystemAndLicensing": "safsfsdaf",
    "numberOfVCPUs": "1",
    "memoryAmount": "1",
    "storageType": "Provisioned IOPS SSD",
    "storageAmount": "1",
    "performanceTier": "Premium",
    "performanceTierOther": "",
    "numberOfInstances": "1"
  };

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
  ];

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
  ];

  const classificationRadioOptions: RadioButton[] = [
    { id: "Option1", label: "label1", value: "IL1" },
    { id: "Option2", label: "label2", value: "IL2" },
  ];

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ComputeFormElements, {
      localVue,
      vuetify,
      mocks: {
        $store: {
          DescriptionOfWork: {
            otherOfferingData: otherOfferingData,
          }
        },
      },
      propsData: {
        computeData: otherOfferingData,
        avlClassificationLevelObjects: avlClassificationLevelObjects,
        firstTimeHere: true,
        isClassificationDataMissing: false,
        isPeriodsDataMissing: false,
        singleClassificationLevelName: "",
        otherRegionValue: "",
        otherPerformanceTierValue: "",
        formHasErrors: false,
        formHasBeenTouched: true,
        classificationRadioOptions: classificationRadioOptions, 
        classificationTooltipText: "",
        availablePeriodCheckboxItems: availablePeriodCheckboxItems,
        validateOtherTierNow: true,
        validateOtherTierOnBlur: true,
        clearOtherTierValidation: true,
      }
    });
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Method Testing...", () => {
    it(`tests that 'openModal' is emitted when user clicks to update 
      classification requirements`, async () => {
      await wrapper.vm.openModal();
      expect(wrapper.emitted().openModal).toBeTruthy();
    });
  });

  describe("testing form fields", () => {
    describe("testing `entire duration` radio button selection", () => {
      it("tests `YES` being selected then clears prop.computeData.periodsNeeded[]", async () => {
        otherOfferingData.entireDuration = 'YES';
        await wrapper.setData({
          _otherOfferingData: otherOfferingData,
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
          otherOfferingData.entireDuration = 'NO';
          await wrapper.setData({
            _otherOfferingData: otherOfferingData,
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

  });

});
