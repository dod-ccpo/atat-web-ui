/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import ReplicateDetails from "@/steps/03-Background/CurrentEnvironment/ReplicateDetails.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { CurrentEnvironmentDTO } from "@/api/models";
import validators from "@/plugins/validation";

vi.mock('@/store/acquisitionPackage/currentEnvironment')

describe("Testing ReplicateDetails Component", () => {

  const mockEnvironment = {
    statement_replicated_optimized: "test statement",
    additional_growth:"YES",
    anticipated_yearly_additional_capacity:2,
    has_phased_approach:"YES",
    phased_approach_schedule:"test schedule",
    current_environment_replicated_optimized: "YES_REPLICATE"
  } as CurrentEnvironmentDTO

  const wrapper:VueWrapper = shallowMount(ReplicateDetails, {
    props: {},
    global: {
      plugins: [validators]
    }
  })
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  beforeEach(() => {
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
  });

  describe("WATCHERS", () => {
    it("testing 'currEnvDTO' watcher", async() => {
      wrapper.setData({
        currEnvDTO:{
          additional_growth:"NO",
          has_phased_approach:"NO"
        }
      })

      await vm.$nextTick();
      expect(vm.$data.currEnvDTO.anticipated_yearly_additional_capacity).toBe(null)

    })

  })

  describe("FUNCTIONS", () => {
    it("test hasChanged() returns true", async () => {
      wrapper.setData({
        currentData:{
          additional_growth:"NO",
          has_phased_approach:"NO"
        }
      })
      await vm.$nextTick();
      const hasChanged = vm.hasChanged()
      expect(hasChanged).toBe(true);
    })

    it("test saveOnLeave() return true", async () => {
      vi.spyOn(CurrentEnvironment, 'setCurrentEnvironment')
        .mockImplementation(() => Promise.resolve())
      wrapper.setData({
        currentData:{
          additional_growth:"NO",
          has_phased_approach:"NO"
        }
      })
      await vm.$nextTick();
      const saveOnLeave = await vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy();
    });
  })
})
