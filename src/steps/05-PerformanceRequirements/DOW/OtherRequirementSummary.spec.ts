import Vue from "vue";
import Vuex from "vuex";
import { createVuetify } from "vuetify";
import { mount, VueWrapper, config } from "@vue/test-utils";
import OtherOfferingSummary from "../DOW/OtherOfferingSummary.vue";
import validators from "../../../plugins/validation";
import DescriptionOfWork from "@/store/descriptionOfWork";
import { 
  DOWServiceOfferingGroup, 
  OtherServiceOfferingData,
} from "../../../../types/Global";
import { SystemChoiceDTO } from "@/api/models";
const Vuetify = createVuetify()
Vue.use(Vuetify);

describe("Testing ServiceOfferingDetails Component", () => {
  Vue.use(validators);
  // is not assignable to parameter of type Plugin<any[]>
  // Vue.use(Vuex);
  let vuetify
  let wrapper: VueWrapper;
  // Property showDeprecationWarnings does not exist on type GlobalConfigOptions
  // config.showDeprecationWarnings = false
  Vue.config.silent = true;

  const otherOfferingData: OtherServiceOfferingData[] = [{
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
  }];

  const DOWObject: DOWServiceOfferingGroup[] = [
    {
      otherOfferingData,
      serviceOfferingGroupId: "COMPUTE",
      sequence: 1,
      serviceOfferings: [],
    },
    {
      serviceOfferingGroupId: "SOMETHING_ELSE",
      sequence: 2,
      serviceOfferings: [],  
    }
  ];

  const serviceOfferingGroups: SystemChoiceDTO[] = [
    {
      "name":"x_g_dis_atat_service_offering",
      "label":"Compute",
      "value":"COMPUTE",
      "sequence":1
    },
    {
      "name":"foo",
      "label":"Something Else",
      "value":"SOMETHING_ELSE",
      "sequence":2
    }
  ]

  beforeEach(() => {
    vuetify = createVuetify()
    wrapper = mount(OtherOfferingSummary, {
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

    it("tests loadOnEnter()", async () => {
      jest.spyOn(DescriptionOfWork, 'getServiceOfferingGroups').mockImplementation(
        ()=>Promise.resolve(
          serviceOfferingGroups
        ));
      jest.spyOn(DescriptionOfWork, 'getOtherOfferingInstances').mockImplementation(
        ()=>Promise.resolve(
          otherOfferingData
        ));
      jest.spyOn(DescriptionOfWork, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
  
      await wrapper.vm.loadOnEnter();
      console.log("computeDataArray", wrapper.vm.$data.computeDataArray);

    });

  });

});
