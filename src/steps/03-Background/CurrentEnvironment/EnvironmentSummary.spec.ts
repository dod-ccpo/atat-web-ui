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

Vue.use(Vuetify);

const mockEnvironment:CurrentEnvironmentDTO = {
  env_location: "HYBRID",
  env_classifications_onprem: ["sys1","sys2"],
  env_classifications_cloud: ["sys1","sys2"]
} as CurrentEnvironmentDTO

const mockEnvInstance:CurrentEnvironmentInstanceDTO[] = [
  {
    storage_type:"BLOCK",
    classification_level:"cc3b52af87970590ec3b777acebb3581",
    performance_tier:"GENERAL",
    instance_location:"CLOUD",
    storage_amount:33,
    number_of_vcpus:32,
    number_of_instances:1,
    storage_unit:"GB",
    memory_amount:1,
    deployed_regions:"",
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
  },
  {
    storage_type:"BLOCK",
    classification_level:"123456",
    performance_tier:"COMPUTE",
    instance_location:"ON_PREM",
    storage_amount:33,
    storage_unit:"GB",
    deployed_regions:"dfdsfds",
  },
] as CurrentEnvironmentInstanceDTO[]
const mockClassificationLevels:ClassificationLevelDTO[] = [
  {
    impact_level: "IL1",
    classification: "test level 1",
    classification_level: "1",
    display: "test level 1",
    dow_task_number_component: 0,
    sys_id:"123456"
  },
  {
    impact_level: "IL2",
    classification: "test level 2",
    classification_level: "2",
    display: "test level 2",
    dow_task_number_component: 1
  },
]

describe("Testing EnvironmentSummary Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(EnvironmentSummary, {
      vuetify,
      localVue
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
        expect(classificationsText).toBe("Deployed within ")
      })
    })
  })
})
