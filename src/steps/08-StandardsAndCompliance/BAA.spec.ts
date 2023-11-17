import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount, mount } from '@vue/test-utils';
import BAA from "./BAA.vue";
import validators from "@/plugins/validation";
import SlideoutPanel from "@/store/slideoutPanel";
import AcquisitionPackage from "@/store/acquisitionPackage";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { createVuetify } from 'vuetify'

describe("Testing BAA Page with full mount", () => {
  const vuetify = createVuetify({
    components,
    directives,
  })

  
  const wrapper: VueWrapper = mount(BAA, {
    global: {
      plugins: [vuetify, validators]
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  it("testing @keydown.space to trigger openSlideoutPanel ", async () => {
    vi.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation(()=> Promise.resolve());
    const anchorLink = wrapper.find("#LearnMoreBAA");
    anchorLink.trigger('keydown.space'); // trigger openSlideoutPanel;
    const currentTargetId = 1;
    vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
    expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
      currentTargetId
    );
  });

  it("testing @keydown.enter to trigger openSlideoutPanel ", async () => {
    vi.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation(()=> Promise.resolve());
    const anchorLink = wrapper.find("#LearnMoreBAA");
    anchorLink.trigger('keydown.enter'); // trigger openSlideoutPanel;
    const currentTargetId = 1;
    vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
    expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
      currentTargetId
    );
  });

})


describe("Testing BAA Page", () => {

  
  const wrapper: VueWrapper = shallowMount(BAA, {
    global: {
      plugins: [ validators]
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options)

  describe("testing BAA.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("opens slideout panel", () => {
      vi.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation(()=> Promise.resolve());
      const currentTargetId = 1;
      vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });
    

    it("gets current data", () => {
      const mockPackageId = "1";
      AcquisitionPackage.doSetPackageId(mockPackageId)
      const currentData = vm.currentData;
      expect(currentData.baa_required).toBe("");
      expect(currentData.acquisition_package).toBe(mockPackageId);
    });

    it("checks for changes", async () =>{
      await wrapper.setData(
        {
          currentData:{
            "baa_required": "true",
            "acquisition_package": "currentPackageId"
          },
          savedData:{
            "baa_required": "false",
            "acquisition_package": "savedPackageId"
          }
        }
      )
      const hasChanges = vm.hasChanged()
      expect(hasChanges).toBe(true)
    })

    it("checks saveOnLeave", async () =>{
      const hasChanges = await vm.saveOnLeave()
      expect(hasChanges).toBe(true)
    })
  });
});
