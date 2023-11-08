/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import EnvironmentSummary from "@/steps/03-Background/CurrentEnvironment/EnvironmentSummary.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import {
  ClassificationLevelDTO,
  CurrentEnvironmentDTO,
  CurrentEnvironmentInstanceDTO,
} from "@/api/models";
import classificationRequirements from "@/store/classificationRequirements";
import { EnvInstanceSummaryTableData } from "../../../../types/Global";

vi.mock('@/store/classificationRequirements')
vi.mock('@/store/acquisitionPackage/currentEnvironment')

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


describe("Testing EnvironmentSummary Component", () => {
  const wrapper:VueWrapper = shallowMount(EnvironmentSummary, {
    props: {

    },
    data() {
      return {
        envInstances: mockEnvInstance
      }
    },
    global: {
      plugins: [],
      mocks: {
        $router: {
          push: vi.fn()
        }
      }

    },
  })
  const vm = (wrapper.vm as typeof wrapper.vm.$options)
  beforeEach(() => {
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockResolvedValue(
      mockEnvironment
    );
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironmentInstances').mockResolvedValue(
      mockEnvInstance
    );
    vi.spyOn(classificationRequirements, 'getAllClassificationLevels').mockResolvedValue(
      mockClassificationLevels
    );
    vi.useFakeTimers()
  })


  describe("testing EnvironmentSummary Component", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe("GETTERS", () => {
      describe("environmentTypeText() => returns correct type   ", () => {
        it("returns Cloud Environment", async () => {
          wrapper.setData({envLocation: "CLOUD"})
          const envType = vm.environmentTypeText;
          await vm.$nextTick();
          vi.advanceTimersByTime(500)
          expect(envType).toBe("Cloud Environment")
        });
        it("returns Cloud Environment", async () => {
          wrapper.setData({envLocation: "ON_PREM"})
          const envType = vm.environmentTypeText;
          await vm.$nextTick();
          vi.advanceTimersByTime(500)
          expect(envType).toBe("On-premise Environment")
        });
      })
      it.skip("classificationsText() => returns correct text", async () => {
        wrapper.setData({envLocation: "ON_PREM", envInstances: mockEnvInstance })
        
        await vm.$nextTick();
        vi.advanceTimersByTime(100)
        const classificationsText = vm.classificationsText;
        expect(classificationsText).toBe("Deployed within Unclassified, Secret and TS")
      })
    })

    describe("FUNCTIONS", () => {
      it("test editEnvironment()", async () => {
        vm.editEnvironment()
        await vm.$nextTick();
        expect(vm.$router.push).toHaveBeenCalled();
      });

      // it("test addInstance()", async () => {
      //   vi.spyOn(CurrentEnvironment, 'setCurrentEnvInstanceNumber').mockImplementation(
      //     () => Promise.resolve()
      //   );
      //   vm.addInstance()
      //   await vm.$nextTick();
      //   expect(vm.$router.push).toHaveBeenCalled();
      // });

      it("test editInstance()", async () => {
        vi.spyOn(CurrentEnvironment, 'setCurrentEnvironmentInstanceNumber').mockImplementation(
          () => Promise.resolve()
        );
        const instance ={
          instanceNumber:2,
          instanceSysId:"4321"
        } as EnvInstanceSummaryTableData

        vm.editInstance(instance)
        await vm.$nextTick();
        expect(vm.$router.push).toHaveBeenCalled();
      });

      it("test confirmDeleteInstance()", async () => {
        const instance ={
          instanceNumber:2,
          instanceSysId:"4321"
        } as EnvInstanceSummaryTableData

        vm.confirmDeleteInstance(instance)
        await vm.$nextTick();
        const showDelete = vm.$data.showDeleteInstanceDialog
        expect(showDelete).toBeTruthy();
      });

      it.skip("test deleteInstance()", async () => {
        vi.spyOn(CurrentEnvironment, 'deleteEnvironmentInstance').mockImplementation(
          () => Promise.resolve()
        );
        vm.deleteInstance()
        await vm.$nextTick();
        const showDelete = vm.$data.showDeleteInstanceDialog
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
        vi.spyOn(CurrentEnvironment, 'saveCurrentEnvironmentInstance').mockImplementation(
          () => Promise.resolve()
        );
        vm.resetInstanceNumbers()
        await vm.$nextTick();
        expect(CurrentEnvironment.saveCurrentEnvironmentInstance).toHaveBeenCalled();
      });

      it("test validateInstance() returns false", async () => {
        const mockInstance = {
          current_usage_description: "IRREGULAR_USAGE",
          pricing_model:"PREPAID",
          pricing_model_expiration:""
        }
        const instance = await vm.validateInstance(mockInstance)
        await vm.$nextTick();
        expect(instance).toBe(false);
      });
    })

  })
})
