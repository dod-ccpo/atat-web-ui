import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import ATATToast from "@/components/ATATToast.vue";
import {DefaultProps} from "vue/types/options";
import Toast from "@/store/toast";
Vue.use(Vuetify);

describe("Testing ATATToast.vue Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATToast, {
      localVue,
      vuetify,
    });
  });

  describe("ATA", () => { 
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("setToastOpen() ", async()=>{
      await wrapper.setData({
        isToastOpen: true
      });
      expect(wrapper.vm.$data.isOpen).toBe(true);
    })

    it("setToast(true)", async () => {
      const isOpen = true;
      wrapper.vm.setToast(isOpen);
      await Vue.nextTick();
      expect(wrapper.vm.$data.isOpen).toBe(isOpen)
    })

    it("setToast(true)", async () => {
      jest.useFakeTimers();
      await wrapper.setData({
        toast:{
          message: "this is a toast message",
          hasUndo: true,
          isOpen: true,
        }
      })
    
      wrapper.vm.setToast(true);
      await Vue.nextTick();
      jest.runAllTimers();
      expect(Toast.toast.isOpen).toBe(false);
    })

    it("getTimeout() with $data.hasUndo && reasonable length message returns 3 seconds", 
      async () => {
        await wrapper.setData({
          toast:{
            message: "this is a toast message",
            hasUndo: false,
          }
        })
        expect(await wrapper.vm.getTimeout).toBe(3000)
      })

    it("getTimeout() with $data.hasUndo adds 2 seconds to returned value of 3 seconds", 
      async () => {
        await wrapper.setData({
          toast:{
            message: "this is a toast message",
            hasUndo: true,
          }
        })
        expect(await wrapper.vm.getTimeout).toBe(5000)
      })

    it("onUndo() ensure right value is emitted", async () => {
      wrapper.vm.onUndo(); 
      expect(wrapper.emitted('toast-undo')).toBeTruthy();
    })
  });
});
