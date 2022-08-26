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

const localVue = createLocalVue();
localVue.use(Vuex);

const mutations = DescriptionOfWorkStore.mutations;
const actions = DescriptionOfWorkStore.actions;
const getters = DescriptionOfWorkStore.getters;
const state = DescriptionOfWorkStore.state;

describe("Testing Description of Work store", () => {
  
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

  const instancesTouched: Record<string, number[]> = {
    "compute": [1, 2, 3]
  };


  let DOWStore: DescriptionOfWorkStore;
  
  beforeEach(() => {
    const createStore = (storeOptions: any = {}):
    Store<{ 
      DOWObject: DOWServiceOfferingGroup[],
      currentGroupId: string,
      otherOfferingInstancesTouched: Record<string, number[]>,
    }> => new Vuex.Store({ ...storeOptions });
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

    it("tests getLastOtherOfferingInstanceNumber()", async () => {
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
      const instanceNumber = await DOWStore.getLastOtherOfferingInstanceNumber();
      console.log("instanceNu", instanceNumber)
      expect(instanceNumber).toEqual(1);
    });

    it("tests deleteOtherOfferingInstance()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      DescriptionOfWork.pushTouchedOtherOfferingInstance(1);
      await DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);

      console.log("DOWObject", DescriptionOfWork.DOWObject);
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
        
      Vue.nextTick(async () => {
        await DOWStore.deleteOtherOfferingInstance(1);
      })
    });

    it("tests setOtherOfferingData()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");

      console.log("DOWObject", DescriptionOfWork.DOWObject);
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
      Vue.nextTick(() => {
        DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);
        Vue.nextTick(() => {
          DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);
          DescriptionOfWork.setSelectedOfferingGroups(["GENERAL_XAAS"]);
          Vue.nextTick(() => {
            DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);
          
          })
        })
      })
    });
    it("tests setOtherOfferingData()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        const otherInstances = await DescriptionOfWork.getOtherOfferingInstances();
        console.log("otherInstances",otherInstances);  
      })
    });

    it("tests hasInstanceBeenTouched()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        let touched = await DescriptionOfWork.hasInstanceBeenTouched(1);
        expect(touched).toBeTruthy();
        DescriptionOfWork.setCurrentOfferingGroupId("Not_a_Group");
        Vue.nextTick(async ()=> {
          touched = await DescriptionOfWork.hasInstanceBeenTouched(1);
          expect(touched).toBeFalsy();  
        })
        

      })
    });


  });

});