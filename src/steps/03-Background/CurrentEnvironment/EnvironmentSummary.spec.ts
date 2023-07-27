/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import EnvironmentSummary from "@/steps/03-Background/CurrentEnvironment/EnvironmentSummary.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {
  ClassificationLevelDTO,
  CurrentEnvironmentDTO,
  CurrentEnvironmentInstanceDTO,
} from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import { EnvInstanceSummaryTableData } from "../../../../types/Global";

Vue.use(Vuetify);

const mockEnvironment:CurrentEnvironmentDTO = {
  env_location: "HYBRID",
  env_classifications_onprem: ["1","2","3"],
  env_classifications_cloud: ["1","2","3"]
} as CurrentEnvironmentDTO

const mockEnvInstance:CurrentEnvironmentInstanceDTO[] = [
  {
    storage_type:"BLOCK",
    classification_level:"2",
    performance_tier:"GENERAL",
    instance_location:"CLOUD",
    storage_amount:33,
    number_of_vcpus:32,
    number_of_instances:1,
    storage_unit:"GB",
    memory_amount:1,
    deployed_regions:[""],
    instance_number: 1,
    current_usage_description: "IRREGULAR_USAGE",
    is_traffic_spike_event_based: "YES",
    is_traffic_spike_period_based: "YES",
    traffic_spike_event_description: "",
    traffic_spike_period_description: ""
  },
  {
    storage_type:"BLOCK",
    classification_level:"123456",
    performance_tier:"COMPUTE",
    instance_location:"ON_PREM",
    storage_amount:33,
    number_of_vcpus:32,
    number_of_instances:1,
    storage_unit:"GB",
    memory_amount:1,
    deployed_regions:["test"],
    instance_number: 2,
    current_usage_description: "IRREGULAR_USAGE",
    traffic_spike_event_description: "",
    traffic_spike_period_description: ""
  },
  {
    storage_type:"BLOCK",
    classification_level:"123456",
    performance_tier:"COMPUTE",
    instance_location:"ON_PREM",
    storage_amount:33,
    storage_unit:"GB",
    deployed_regions:"dfdsfds",
    instance_number: 0,
  },
  {
    storage_type:"BLOCK",
    classification_level:"123456",
    performance_tier:"COMPUTE",
    instance_location:"",
    storage_amount:33,
    storage_unit:"GB",
    deployed_regions:"dfdsfds",
    instance_number: 0,

  },
] as CurrentEnvironmentInstanceDTO[]
const mockClassificationLevels:ClassificationLevelDTO[] = [
  {
    impact_level: "IL1",
    classification: "U",
    classification_level: "1",
    display: "test level 1",
    dow_task_number_component: 0,
    sys_id:"1"
  },
  {
    impact_level: "IL5",
    classification: "S",
    classification_level: "2",
    display: "test level 2",
    dow_task_number_component: 1,
    sys_id:"2"
  },{
    impact_level: "IL6",
    classification: "TS",
    classification_level: "3",
    display: "test level 3",
    dow_task_number_component: 2,
    sys_id:"3"
  },
]
const mockRouter = {
  push: jest.fn()
}

describe("Testing EnvironmentSummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EnvironmentSummary, {
      vuetify,
      localVue,
      mocks:{
        $router: mockRouter
      }
    });
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironmentInstances').mockImplementation(
      () => Promise.resolve(mockEnvInstance)
    );
    jest.spyOn(classificationRequirements, 'getAllClassificationLevels').mockImplementation(
      () => Promise.resolve(mockClassificationLevels)
    );
    jest.useFakeTimers()
  });

  describe("testing EnvironmentSummary Component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe("GETTERS", () => {
      describe("environmentTypeText() => returns correct type   ", () => {
        it("returns Cloud Environment", async () => {
          wrapper.setData({envLocation: "CLOUD"})
          const envType = wrapper.vm.environmentTypeText;
          await Vue.nextTick();
          jest.advanceTimersByTime(100)
          expect(envType).toBe("Cloud Environment")
        });
        it("returns Cloud Environment", async () => {
          wrapper.setData({envLocation: "ON_PREM"})
          const envType = wrapper.vm.environmentTypeText;
          await Vue.nextTick();
          jest.advanceTimersByTime(100)
          expect(envType).toBe("On-premise Environment")
        });
      })
      it("classificationsText() => returns correct text", async () => {
        wrapper.setData({envLocation: "ON_PREM"})
        const classificationsText = wrapper.vm.classificationsText;
        await Vue.nextTick();
        expect(classificationsText).toBe("Deployed within Unclassified, Secret and TS")
      })
    })

    describe("FUNCTIONS", () => {
      it("test editEnvironment()", async () => {
        wrapper.vm.editEnvironment()
        await Vue.nextTick();
        expect(mockRouter.push).toHaveBeenCalled();
      });

      it("test addInstance()", async () => {
        jest.spyOn(CurrentEnvironment, 'setCurrentEnvInstanceNumber').mockImplementation(
          () => Promise.resolve()
        );
        wrapper.vm.addInstance()
        await Vue.nextTick();
        expect(mockRouter.push).toHaveBeenCalled();
      });

      it("test editInstance()", async () => {
        jest.spyOn(CurrentEnvironment, 'setCurrentEnvironmentInstanceNumber').mockImplementation(
          () => Promise.resolve()
        );
        const instance ={
          instanceNumber:2,
          instanceSysId:"4321"
        } as EnvInstanceSummaryTableData

        wrapper.vm.editInstance(instance)
        await Vue.nextTick();
        expect(mockRouter.push).toHaveBeenCalled();
      });

      it("test confirmDeleteInstance()", async () => {
        const instance ={
          instanceNumber:2,
          instanceSysId:"4321"
        } as EnvInstanceSummaryTableData

        wrapper.vm.confirmDeleteInstance(instance)
        await Vue.nextTick();
        const showDelete = wrapper.vm.$data.showDeleteInstanceDialog
        expect(showDelete).toBeTruthy();
      });

      it("test deleteInstance()", async () => {
        jest.spyOn(CurrentEnvironment, 'deleteEnvironmentInstance').mockImplementation(
          () => Promise.resolve()
        );
        wrapper.vm.deleteInstance()
        await Vue.nextTick();
        const showDelete = wrapper.vm.$data.showDeleteInstanceDialog
        expect(showDelete).toBe(false);
      });

      it("test resetInstanceNumbers()", async () => {
        wrapper.setData({
          envInstances:mockEnvInstance,
          tableData:[
            {
              instanceSysId:1,
            },
            {
              instanceSysId:4,
            },
          ]
        })
        jest.spyOn(CurrentEnvironment, 'saveCurrentEnvironmentInstance').mockImplementation(
          () => Promise.resolve()
        );
        wrapper.vm.resetInstanceNumbers()
        await Vue.nextTick();
        expect(CurrentEnvironment.saveCurrentEnvironmentInstance).toHaveBeenCalled();
      });

      it("test validateInstance() returns false", async () => {
        const mockInstance = {
          current_usage_description: "IRREGULAR_USAGE",
          pricing_model:"PREPAID",
          pricing_model_expiration:""
        }
        const instance = await wrapper.vm.validateInstance(mockInstance)
        await Vue.nextTick();
        expect(instance).toBe(false);
      });
    })

  })
})
