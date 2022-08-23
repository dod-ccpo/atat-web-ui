import Vue, { computed } from "vue";
import Vuex from "vuex";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import ComputeRequirements from "../DOW/ComputeRequirements.vue";
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

  const computeData: OtherServiceOfferingData = {
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
    memory: "",
    storageType: "",
    storageAmount: "",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstancesNeeded: "1",
    requirementTitle: "",
  }

  const computeDOWObj = {
    computeData,
    serviceOfferingGroupId: "COMPUTE",
    sequence: 1,
    ServiceOfferings: [],
  }

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ComputeRequirements, {
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

    it("tests that isCompute sets to true", async () => {
      // sets `isCompute` to true in loadOnEnter()
      
      console.log("otherOfferingData", wrapper.vm.$data.otherOfferingData);
      await DescriptionOfWork.addOfferingGroup("COMPUTE");
      await DescriptionOfWork.setComputeData(computeData);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      await wrapper.vm.loadOnEnter();
      console.log("computeDataArray", wrapper.vm.$data.computeDataArray);

    });

  });



});
