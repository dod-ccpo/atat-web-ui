/* eslint-disable camelcase */
import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import OtherOfferingSummary from "@/steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import DescriptionOfWork from "@/store/descriptionOfWork";
import VueRouter from 'vue-router'
import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";

describe("Testing OtherOfferingSummary Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
  localVue.use(VueRouter)
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  beforeEach(async () => {
    vuetify = new Vuetify();
    wrapper = mount(OtherOfferingSummary, {
      localVue,
      vuetify,
    });
    jest.spyOn(DescriptionOfWork, 'getOtherOfferingInstances').mockImplementation(
      () => Promise.resolve(
        [
          {
            anticipatedNeedUsage: "test",
            classificationLevel: "level1",
            deployedRegions: [],
            deployedRegionsOther: "",
            descriptionOfNeed: "",
            entireDuration: "YES",
            environmentType: "",
            instanceNumber: 1,
            memoryAmount: "1",
            numberOfInstances: "1",
            numberOfVCPUs: "1",
            operatingSystemAndLicensing: "",
            performanceTier: "Other",
            performanceTierOther: "",
            periodsNeeded: [],
            requirementTitle: "dw",
            storageAmount: "1",
            storageType: "",
          },
          {
            anticipatedNeedUsage: "test2",
            classificationLevel: "level2",
            deployedRegions: [],
            deployedRegionsOther: "",
            descriptionOfNeed: "",
            entireDuration: "NO",
            environmentType: "",
            instanceNumber: 2,
            memoryAmount: "2",
            numberOfInstances: "2",
            numberOfVCPUs: "",
            operatingSystemAndLicensing: "",
            performanceTier: "",
            performanceTierOther: "",
            periodsNeeded: [],
            requirementTitle: "dw",
            storageAmount: "2",
            storageType: "",
          }
        ]
      ));
    ClassificationRequirements.setSelectedClassificationLevels([
      {
        impact_level: "level1",
        classification: "level1",
        sys_id:"level1",
        classification_level: {value: "v1", link: ""},
        acquisition_package: {value: "a1", link: ""}
      },
      {
        impact_level: "level2",
        classification: "level2",
        sys_id:"level2",
        classification_level: {value: "v2", link: ""},
        acquisition_package: {value: "a1", link: ""}
      }
    ])
    jest.spyOn(Periods,'getAllPeriods').mockImplementation(
      () => Promise.resolve([
        {
          option_order: "1",
          period_type: "BASE",
          period_unit: "YEAR",
          period_unit_count: "1",
        },
      ])
    )
    wrapper.vm.loadOnEnter();
  });

  describe('Testing OtherOfferingSummary with Compute as offering', () => {
    beforeEach(async () => {
      jest.spyOn(DescriptionOfWork, 'getCurrentOfferingGroupId').mockImplementation(
        ()=>Promise.resolve(
          "Compute"
        ));
      wrapper.vm.loadOnEnter();
    });

    it('should Initialize with this.isCompute = true', () => {
      const isCompute = wrapper.vm.$data.isCompute
      expect(isCompute).toBe(true)
    })

    it('Testing function addInstance()',async () => {
      jest.spyOn(DescriptionOfWork, 'getLastOtherOfferingInstanceNumber').mockImplementation(
        ()=>Promise.resolve(
          1
        ));
      jest.spyOn(wrapper.vm,'addInstance')
      wrapper.find('#AddInstance').trigger('click');
      await wrapper.vm.$nextTick()
      expect(wrapper.vm.addInstance).toHaveBeenCalled()
    })

    // Errors with: ERR_UNHANDLED_REJECTION
    it('Testing function editInstance()',async () => {
      const item = {
        duration: "Entire task order",
        instanceNumber: 1,
        requirementTitle: "test",
        typeOrTitle: "test",
      }
      jest.spyOn(wrapper.vm,'editInstance')
      jest.spyOn(wrapper.vm, 'navigate').mockImplementation();
      await wrapper.vm.editInstance(item)

      const instanceNumber = DescriptionOfWork.currentOtherServiceInstanceNumber;
      expect(instanceNumber).toBe(1);
    })

    it('Testing confirmDeleteInstance() sets showDeleteInstanceDialog to true ',async () => {
      const item = {duration: "Entire task order",
        instanceNumber: 1,
        requirementTitle: "test ",
        typeOrTitle: "test ",}
      wrapper.vm.confirmDeleteInstance(item)
      expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(true)
    })

    it('Testing function deleteOffering()  ',async () => {
      jest.spyOn(DescriptionOfWork,'deleteOtherOffering').mockImplementation()
      jest.spyOn(wrapper.vm,'deleteOffering')
      jest.spyOn(wrapper.vm, 'navigate').mockImplementation();
      wrapper.vm.deleteOffering()
      expect(wrapper.vm.deleteOffering).toHaveBeenCalled()
    })

    it('Testing function deleteInstance()',async () => {
      jest.spyOn(wrapper.vm,'deleteInstance')
      jest.spyOn(DescriptionOfWork,'deleteOtherOfferingInstance').mockImplementation()
      wrapper.vm.deleteInstance();
      expect(wrapper.vm.deleteInstance).toHaveBeenCalled()
      expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(false)
    })

    it('Testing function cancelDeleteOffering()',async () => {
      jest.spyOn(wrapper.vm,'cancelDeleteOffering')
      wrapper.vm.cancelDeleteOffering();
      expect(wrapper.vm.cancelDeleteOffering).toHaveBeenCalled()
    })

  })

  describe('Testing OtherOfferingSummary with General as offering', () => {
    beforeEach(async () => {
      jest.spyOn(DescriptionOfWork, 'getCurrentOfferingGroupId').mockImplementation(
        ()=>Promise.resolve(
          "general_xaas"
        ));
      wrapper.vm.loadOnEnter();
    });
    it('should Initialize with this.isCompute = true', () => {
      const isGeneral = wrapper.vm.$data.isGeneral
      expect(isGeneral).toBe(true)
    })

  })

  describe('Testing OtherOfferingSummary with database as offering', () => {
    beforeEach(async () => {
      jest.spyOn(DescriptionOfWork, 'getCurrentOfferingGroupId').mockImplementation(
        ()=>Promise.resolve(
          "database"
        ));
      wrapper.vm.loadOnEnter();
    });
    it('should Initialize with this.isCompute = true', () => {
      const isDatabase = wrapper.vm.$data.isDatabase
      expect(isDatabase).toBe(true)
    })

  })
})
