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
import AcquisitionPackage from "../acquisitionPackage";

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
    memoryAmount: "",
    storageType: "",
    storageAmount: "",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstances: "1",
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
    AcquisitionPackage.setProjectOverview({
      title: "",
      scope: "",
      // eslint-disable-next-line camelcase
      emergency_declaration:""
    })
    AcquisitionPackage.setOrganization({})  
  });

  afterEach(()=>{
    jest.clearAllMocks();
    jest.clearAllTimers();
  })

  describe("Methods...", () => {
    it.skip("tests getting DOW Object", async () => {
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
      const returnedDOWObj = await DOWStore.getDOWObject();
      expect(returnedDOWObj).toEqual(DOWObject);
    });

    it.skip("tests getLastOtherOfferingInstanceNumber()", async () => {
      DescriptionOfWork.setCurrentOfferingGroupId("FOO");
      const instanceNumber = await DOWStore.getLastOtherOfferingInstanceNumber();
      expect(instanceNumber).toEqual(1);

      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      DescriptionOfWork.pushTouchedOtherOfferingInstance(1);
      await DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);
      jest.spyOn(DOWStore, 'getDOWObject').mockImplementation(
        ()=>Promise.resolve(
          DOWObject
        ));
      Vue.nextTick(async () => {
        const instanceNumber = await DOWStore.getLastOtherOfferingInstanceNumber();
        console.log("instanceNu", instanceNumber)
        expect(instanceNumber).toEqual(1);
      })
    });

    it.skip("tests deleteOtherOfferingInstance()", async () => {
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

    it.skip("tests setOtherOfferingData()", async () => {
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
    it.skip("tests getOtherOfferingInstances()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        const otherInstances = await DescriptionOfWork.getOtherOfferingInstances();
        console.log("otherInstances",otherInstances);  
      })
    });

    it.skip("tests getOtherOfferingInstance()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        let otherInstance = await DescriptionOfWork.getOtherOfferingInstance(1);
        expect(otherInstance.instanceNumber).toEqual(0);
        await DescriptionOfWork.setOtherOfferingData(otherOfferingData[0]);
        Vue.nextTick(async () => {
          otherInstance = await DescriptionOfWork.getOtherOfferingInstance(1);
          expect(otherInstance.instanceNumber).toEqual(1);
        });
      });
    });

    it.skip("tests hasInstanceBeenTouched()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        let touched = await DescriptionOfWork.hasInstanceBeenTouched(1);
        expect(touched).toBeTruthy();
        DescriptionOfWork.setCurrentOfferingGroupId("Not_a_Group");
        Vue.nextTick(async ()=> {
          touched = await DescriptionOfWork.hasInstanceBeenTouched(1);
          expect(touched).toBeFalsy();  
        });
      });
    });

    it.skip("tests deleteOtherOffering()", async () => {
      DescriptionOfWork.setSelectedOfferingGroups(["COMPUTE", "SomethingElse"]);
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      Vue.nextTick(async () => {
        await DescriptionOfWork.deleteOtherOffering();
        expect(DescriptionOfWork.DOWObject.length).toEqual(1);
      });
    });

  });

});