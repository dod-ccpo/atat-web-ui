import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import ServiceOfferings from "../DOW/ServiceOfferings.vue";
import { DefaultProps } from "vue/types/options";
import validators from "../../../plugins/validation";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { OtherServiceOfferingData } from "../../../../types/Global"
Vue.use(Vuetify);

describe("Testing ServiceOfferingDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  localVue.use(Vuex);  
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const otherOfferingData: OtherServiceOfferingData = {
    instanceNumber: 1,
    environmentType: "",
    classificationLevel: "",
    deployedRegions: [],
    deployedRegionsOther: "",
    descriptionOfNeed: "",
    entireDuration: "",
    periodsNeeded: [],
    operatingSystemAndLicensing: "",
    numberOfVCPUs: "",
    memoryAmount: "",
    storageType: "",
    storageAmount: "",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstances: "1",
    requirementTitle: "",
  }

  const computeDOWObj = {
    otherOfferingData,
    serviceOfferingGroupId: "COMPUTE",
    sequence: 1,
    ServiceOfferings: [],
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ServiceOfferings, {
      localVue,
      vuetify,
      propsData: {
        isCompute: false,
        isGeneral: false,
      },
    });
  });

  describe("Initialization...", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Methods...", () => {
    it("tests that isServiceOfferingList sets to true", async () => {
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.isServiceOfferingList).toBeTruthy();
    });

    it("tests that isCompute sets to true", async () => {
      // sets `isCompute` to true in loadOnEnter()
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.isCompute).toBeTruthy();
      console.log("otherOfferingData", wrapper.vm.$data.otherOfferingData);
    });

    it("tests that isCompute sets to true", async () => {
      // sets `isCompute` to true in loadOnEnter()
      
      console.log("otherOfferingData", wrapper.vm.$data.otherOfferingData);
      await DescriptionOfWork.addOfferingGroup("COMPUTE");
      await DescriptionOfWork.setOtherOfferingData(otherOfferingData);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      await wrapper.vm.loadOnEnter();
      console.log("computeDataArray", wrapper.vm.$data.computeDataArray);

    });

    it("tests that isGeneral sets to true", async () => {
      // sets `isCompute` to true in loadOnEnter()
      DescriptionOfWork.setCurrentOfferingGroupId("GENERAL_XAAS");
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.isGeneral).toBeTruthy();
    });

  });



});
