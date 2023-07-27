/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ReplicateDetails from "@/steps/03-Background/CurrentEnvironment/ReplicateDetails.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import { CurrentEnvironmentDTO } from "@/api/models";
import validators from "@/plugins/validation";

Vue.use(Vuetify);

describe("Testing ReplicateDetails Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  const mockEnvironment = {
    statement_replicated_optimized: "test statement",
    additional_growth:"YES",
    anticipated_yearly_additional_capacity:2,
    has_phased_approach:"YES",
    phased_approach_schedule:"test schedule",
    current_environment_replicated_optimized: "YES_REPLICATE"
  } as CurrentEnvironmentDTO

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ReplicateDetails, {
      vuetify,
      localVue
    });
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
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

      await Vue.nextTick();
      expect(wrapper.vm.$data.currEnvDTO.anticipated_yearly_additional_capacity).toBe(null)

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
      await Vue.nextTick();
      const hasChanged = wrapper.vm.hasChanged()
      expect(hasChanged).toBe(true);
    })

    it("test saveOnLeave() return true", async () => {
      wrapper.setData({
        currentData:{
          additional_growth:"NO",
          has_phased_approach:"NO"
        }
      })
      await Vue.nextTick();
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy();
    });
  })
})
