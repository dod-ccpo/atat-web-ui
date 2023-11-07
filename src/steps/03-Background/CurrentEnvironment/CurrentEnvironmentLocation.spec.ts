/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import validators from "../../../plugins/validation";
// eslint-disable-next-line max-len
import CurrentEnvironmentLocation from "@/steps/03-Background/CurrentEnvironment/CurrentEnvironmentLocation.vue"
import { CurrentEnvironmentDTO, CurrentEnvironmentInstanceDTO } from "@/api/models";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";

describe("Testing CurrentEnvironment Component", () => {
  const wrapper:VueWrapper = shallowMount(CurrentEnvironmentLocation, {
    props: {

    },
    global: {
      plugins: [validators]
    }
  })
  const vm = (wrapper.vm as typeof wrapper.vm.$options)
  const mockEnvironment = {
    env_location: "CLOUD"
  } as CurrentEnvironmentDTO

  const mockEnvInstances:CurrentEnvironmentInstanceDTO[] = [
    {instance_location:"CLOUD", sys_id: "1"},
    {instance_location:"ON_PREM", sys_id: "2"},
    {instance_location:"HYBRID", sys_id: "3"}
  ] as CurrentEnvironmentInstanceDTO[]

  beforeEach(() => {
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironment').mockImplementation(
      () => Promise.resolve(mockEnvironment)
    );
    vi.spyOn(CurrentEnvironment, 'getCurrentEnvironmentInstances').mockImplementation(
      () => Promise.resolve(mockEnvInstances)
    );

  });
  describe("GETTERS", () => {
    it("test get envInstances",async () => {
      expect(vm.envInstances).toHaveLength(0)
    });

    it("test get currentData",async () => {
      wrapper.setData({currentEnvironmentLocation:""})
      await vm.$nextTick();
      const currentData = vm.currentData
      expect(currentData).toStrictEqual({"env_location": ""})
    });
    it("test get deleteInstanceType returns 'ON_PREM'",async () => {
      wrapper.setData({changeToEnv: "CLOUD"})
      expect(vm.deleteInstanceType).toBe("ON_PREM")
    });

    it("test get deleteInstanceType returns 'CLOUD'",async () => {
      wrapper.setData({changeToEnv: "DUMMY_ENV"})
      expect(vm.deleteInstanceType).toBe("CLOUD")
    });
    


  })

  describe("WATCHERS", () => {
    beforeEach(()=>{
      vi.spyOn(vm, 'hasInstances').mockImplementation(
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

      await vm.$nextTick();
      //vm.$data.currentEnvironmentLocation = "ON_PREM"
      wrapper.setData({
        currentEnvironmentLocation: 'ON_PREM'
      })
      //await vm.$nextTick()
      expect(vm.$data.showConfirmDialog).toBe(true)

    })

  })
  describe("FUNCTIONS", () => {

    it("test cancelDeleteInstances()", async() => {
      vm.cancelDeleteInstances()
      const confirmDialog = vm.$data.showConfirmDialog
      expect(confirmDialog).toBe(false);
    })
    describe("deleteInstances() => ", () => {
      it("ensure store functions get called", async() => {
        const deleteEnvInstanceMock = 
          vi.spyOn(CurrentEnvironment, "deleteEnvironmentInstance").mockImplementation(
            async ()=>Promise.resolve()
          );
        const clearEnvClassificationsMock = 
          vi.spyOn(CurrentEnvironment, "clearEnvClassifications").mockImplementation(
            async ()=>Promise.resolve()
          );

        CurrentEnvironment.setCurrentEnvironmentInstances(mockEnvInstances)
        await vm.deleteInstances()
        expect(deleteEnvInstanceMock).toHaveBeenCalled();
        expect(clearEnvClassificationsMock).toHaveBeenCalled();
      })
      it("sets $data.instanceRemovedToast.message to `On-premise`", async() => {
        const dummyEnv = "CLOUD"
        vm.$data.changeToEnv = dummyEnv
        await vm.deleteInstances()
        expect (vm.$data.instanceRemovedToast.message).toContain("On-premise")
      })
      it("sets $data.instanceRemovedToast.message to `Cloud`", async() => {
        const dummyEnv = ""
        vm.$data.changeToEnv = dummyEnv
        await vm.deleteInstances()
        expect (vm.$data.instanceRemovedToast.message).toContain("Cloud")
      })
    })
    //TODO figure out why its returning a Promise
    it.skip("test hasInstances() return true", async() => {
      CurrentEnvironment.setCurrentEnvironmentInstances(mockEnvInstances)
      console.log(vm.hasInstances('CLOUD'))
      await vm.$nextTick(() => expect(vm.hasInstances('ON_PREM')).toBe(true))
      
    })

    it("saveOnLeave()", async () => {
      vi.spyOn(CurrentEnvironment, 'setCurrentEnvironment')
        .mockImplementation(async () => Promise.resolve())
      wrapper.setData({
        currentData: {env_location: "ON_PREM"},
        savedData: {env_location: "CLOUD"}
      })
      const saveOnLeave = await vm.saveOnLeave()
      expect(saveOnLeave).toBe(true);
    });
  })
})
