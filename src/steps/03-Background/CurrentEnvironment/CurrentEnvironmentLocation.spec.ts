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
    {instance_location:"CLOUD", sys_id: "1"},
    {instance_location:"ON_PREM", sys_id: "2"},
    {instance_location:"HYBRID", sys_id: "3"}
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
    it("test get deleteInstanceType returns 'ON_PREM'",async () => {
      wrapper.setData({changeToEnv: "CLOUD"})
      expect(wrapper.vm.deleteInstanceType).toBe("ON_PREM")
    });

    it("test get deleteInstanceType returns 'CLOUD'",async () => {
      wrapper.setData({changeToEnv: "DUMMY_ENV"})
      expect(wrapper.vm.deleteInstanceType).toBe("CLOUD")
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
    describe("deleteInstances() => ", () => {
      it("ensure store functions get called", async() => {
        const deleteEnvInstanceMock = 
          jest.spyOn(CurrentEnvironment, "deleteEnvironmentInstance").mockImplementation(
            async ()=>Promise.resolve()
          );
        const clearEnvClassificationsMock = 
          jest.spyOn(CurrentEnvironment, "clearEnvClassifications").mockImplementation(
            async ()=>Promise.resolve()
          );

        await CurrentEnvironment.setCurrentEnvironmentInstances(mockEnvInstances)
        await wrapper.vm.deleteInstances()
        expect(deleteEnvInstanceMock).toHaveBeenCalled();
        expect(clearEnvClassificationsMock).toHaveBeenCalled();
      })
      it("sets $data.instanceRemovedToast.message to `On-premise`", async() => {
        const dummyEnv = "CLOUD"
        wrapper.vm.$data.changeToEnv = dummyEnv
        await wrapper.vm.deleteInstances()
        expect (wrapper.vm.$data.instanceRemovedToast.message).toContain("On-premise")
      })
      it("sets $data.instanceRemovedToast.message to `Cloud`", async() => {
        const dummyEnv = ""
        wrapper.vm.$data.changeToEnv = dummyEnv
        await wrapper.vm.deleteInstances()
        expect (wrapper.vm.$data.instanceRemovedToast.message).toContain("Cloud")
      })
    })

    it("test hasInstances() return true", async() => {
      await CurrentEnvironment.setCurrentEnvironmentInstances(mockEnvInstances)
      console.log(wrapper.vm.envInstances);
      expect(wrapper.vm.hasInstances('CLOUD')).toBe(true);
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
