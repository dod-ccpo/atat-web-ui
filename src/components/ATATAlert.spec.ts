import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ATATAlert from "@/components/ATATAlert.vue";

Vue.use(Vuetify);

describe("Testing ATATStepperNavigation", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(ATATAlert, {
      vuetify,
      localVue
    });
  });

  describe("testing ATATAlert", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("getClasses() set $props.type & $props.maxHeight to retrieve certain class(es)", 
      async () => {
        await wrapper.setProps({
          type: "callout",
          maxHeight: "100px"
        });
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_callout _scrollable py-0 pr-0 bg-info-lighter");
      });

    it("getClasses() set $props.type to retrieve certain class", 
      async () => {
        await wrapper.setProps({
          type: "callout",
        });
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_callout bg-info-lighter");
      });

    it("getClasses() set $props.borderLeft to retrieve certain class(es)", 
      async () => {
        await wrapper.setProps({
          borderLeft: true
        });
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_error-alert _border-left-thick");
      });

    it("getClasses() set !$props.borderLeft to retrieve certain class", 
      async () => {
        await wrapper.setProps({
          borderLeft: false
        });
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_error-alert");
      });

      
    it("getClasses() set $props.maxHeight to retrieve certain class(es)", 
      async () => {
        await wrapper.setProps({
          maxHeight: "100px"
        });
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_error-alert py-0 pr-0");
      });

    it("getClasses() setting no props to retrieve default class name", 
      async () => {
        const _getClasses = await wrapper.vm.getClasses;
        expect(_getClasses).toBe("_error-alert");
      });

    it("getIconSize() - setting $props.size==='large' to retrieve certain class", async ()=>{
      await wrapper.setProps({
        size: "large"
      })
      const inputClass = await wrapper.vm.getIconSize();
      expect(inputClass).toBe("icon-24");
    })

    it("getIconSize() - setting $props.size==='small' to retrieve certain class", async ()=>{
      await wrapper.setProps({
        size: "small"
      })
      const inputClass = await wrapper.vm.getIconSize();
      expect(inputClass).toBe("icon-20");
    })

    it("getIcon() - setting $props.type==='success' to retrieve certain icon", async ()=>{
      await wrapper.setProps({
        type: "success"
      })
      const inputClass = await wrapper.vm.getIcon();
      expect(inputClass).toBe("check_circle");
    })

    it("getIcon() - setting $props.size==='error' to retrieve error icon", async ()=>{
      const _type= "error"
      await wrapper.setProps({
        type: _type
      })
      const inputClass = await wrapper.vm.getIcon();
      expect(inputClass).toBe(_type);
    })

    it("close() - sets $prop.show to false and closes the alert",  async ()=> {
      await wrapper.vm.close();
      expect(wrapper.vm.$props.show).toBe(false);
    })
  
    
  });
});
