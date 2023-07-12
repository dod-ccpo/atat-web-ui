/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import validators from "../../../plugins/validation";
// eslint-disable-next-line max-len
import CurrentEnvironmentLocation from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironmentLocation.vue"
import { CurrentEnvironmentDTO, CurrentEnvironmentInstanceDTO } from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";

describe("Testing CurrentEnvironment Component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  const mockEnvironment = {
    env_location: "CLOUD"
  } as CurrentEnvironmentDTO

  const mockEnvInstances:CurrentEnvironmentInstanceDTO[] = [
    {instance_location:"CLOUD"},
    {instance_location:"ON_PREM"},
    {instance_location:"HYBRID"}
  ] as CurrentEnvironmentInstanceDTO[]

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentEnvironmentLocation, {
      localVue,
      vuetify,
    });
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    jest.spyOn(CurrentEnvironment, 'getCurrentEnvironmentInstances').mockImplementation(
      () => Promise.resolve(mockEnvInstances)
    );

  });
  describe("GETTERS", () => {
    it("test get envInstances",async () => {
      expect(wrapper.vm.envInstances).toHaveLength(0)
    });

    it("test get currentData",async () => {
      wrapper.setData({currentEnvironmentLocation:""})
      await Vue.nextTick();
      const currentData = wrapper.vm.currentData
      expect(currentData).toStrictEqual({"env_location": ""})
    });


  })

  describe("WATCHERS", () => {
    beforeEach(()=>{
      jest.spyOn(wrapper.vm, 'hasInstances').mockImplementation(
        () => Promise.resolve(true)
      );
    })
    it("testing 'currentEnvironmentLocation' watcher", async() => {
      wrapper.setData(
        {
          hasCloudInstances:true,
          currentEnvironmentLocation:"CLOUD"
        }
      )

      await Vue.nextTick();
      wrapper.vm.$data.currentEnvironmentLocation = "ON_PREM"
      expect(wrapper.vm.$data.showConfirmDialog).toBe(false)

    })

  })
  describe("FUNCTIONS", () => {

    it("test cancelDeleteInstances()", async() => {
      const confirmDialog = wrapper.vm.$data.showConfirmDialog
      wrapper.vm.cancelDeleteInstances()
      expect(confirmDialog).toBe(false);
    })
    it("test deleteInstances()", async() => {
      const confirmDialog = wrapper.vm.$data.showConfirmDialog
      console.log(wrapper.vm.$data.envInstances)
      wrapper.vm.deleteInstances()
      expect(confirmDialog).toBe(false);
    })


    it("saveOnLeave()", async () => {
      wrapper.setData({
        currentData: {env_location: "ON_PREM"},
        savedData: {env_location: "CLOUD"}
      })
      const saveOnLeave = await wrapper.vm.saveOnLeave()
      expect(saveOnLeave).toBeTruthy();
    });
  })
})
