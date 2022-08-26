import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import OtherOfferingSummary from "@/steps/05-PerformanceRequirements/DOW/OtherOfferingSummary.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import DescriptionOfWork from "@/store/descriptionOfWork";

describe("Testing OtherOfferingSummary Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);
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
            memory: "",
            numberOfInstancesNeeded: "1",
            numberOfVCPUs: "",
            operatingSystemAndLicensing: "",
            performanceTier: "",
            performanceTierOther: "",
            periodsNeeded: [],
            requirementTitle: "dw",
            storageAmount: "",
            storageType: "",
          }
        ]
      ));

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

    // it('Testing function editInstance()',async () => {
    //   console.log(wrapper.vm.$data.offeringInstances)
    //   jest.spyOn(wrapper.vm,'editInstance')
    //   wrapper.find('#EditButton_1').trigger('click')
    //   await wrapper.vm.$nextTick()
    //   expect(wrapper.vm.editInstance).toHaveBeenCalled()
    // })
    //
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
