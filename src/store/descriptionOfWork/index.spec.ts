import Vue, { computed } from "vue";
import Vuex, { Store } from 'vuex';
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper, config } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";

import { getModule } from 'vuex-module-decorators';
// import storeHelperFunctions  from "../helpers";

import DescriptionOfWork, { DescriptionOfWorkStore } from "@/store/descriptionOfWork";

import { 
  DOWServiceOfferingGroup, 
  DOWServiceOffering, 
  DOWClassificationInstance,
  OtherServiceOfferingData,
} from "../../../types/Global";


Vue.use(Vuetify);

describe("Testing OtherOfferings Component", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  config.showDeprecationWarnings = false
  Vue.config.silent = true;


  const mutations = DescriptionOfWorkStore.mutations;
  const actions = DescriptionOfWorkStore.actions;
  const getters = DescriptionOfWorkStore.getters;
  const state = DescriptionOfWorkStore.state;
  
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
    memory: "",
    storageType: "",
    storageAmount: "",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstancesNeeded: "1",
    requirementTitle: "",
  }]

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
  let DOWStore: DescriptionOfWorkStore;
  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
    Store<{ DOWObject: DOWServiceOfferingGroup[] }> => new Vuex.Store({ ...storeOptions });
    DOWStore = getModule(DescriptionOfWorkStore, createStore());    

  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe("Methods...", () => {
    it("tests getting DOW Object", async () => {
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
      const returnedDOWObj = await DOWStore.getDOWObject();
      expect(returnedDOWObj).toEqual(DOWObject);
    });

  });

});