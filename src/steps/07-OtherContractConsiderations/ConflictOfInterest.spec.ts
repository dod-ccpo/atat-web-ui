import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, mount } from '@vue/test-utils';
import ConflictOfInterest from "@/steps/07-OtherContractConsiderations/ConflictOfInterest.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})

const wrapper: VueWrapper = mount(ConflictOfInterest, {
  global: {
    plugins: [vuetify, validators]
  }
});
const vm =  (wrapper.vm as typeof wrapper.vm.$options)

describe("Testing Conflict of Interest Page", () => {


  describe("testing Conflict of Interest Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("opens slideout panel on click", async () => {
      const openSlideoutPanelSpy = vi
        .spyOn(vm, 'openSlideoutPanel');
      console.log("here's wrapper.html", wrapper.html());
      wrapper.find('#CoILearnMore').trigger('keydown.enter');
      expect(openSlideoutPanelSpy).toHaveBeenCalled();
    });

    it("changes explanation when hasConflict changes to 'NO'", async () => {
      wrapper.setData({ hasConflict: 'YES', explanation: 'Test explanation' });
      await vm.$nextTick();
      wrapper.setData({ hasConflict: 'NO' });
      await vm.$nextTick();
      expect(vm.explanation).toBe('');
    });

    it("saves data on leave when data has changed", async () => {
      AcquisitionPackage.saveData = vi.fn();
      const saveOnLeaveSpy = vi.spyOn(vm, 'saveOnLeave');
      const isChangedSpy = vi
        .spyOn(vm, 'isChanged').mockReturnValue(true);
      await vm.saveOnLeave();
      expect(isChangedSpy).toHaveBeenCalled();
      expect(saveOnLeaveSpy).toHaveBeenCalled();
    });

    it("loads data on enter", async () => {
      AcquisitionPackage.loadData = vi.fn().mockReturnValue(true);
      const loadOnEnterSpy = vi.spyOn(vm, 'loadOnEnter');
      await vm.loadOnEnter();
      expect(loadOnEnterSpy).toHaveBeenCalled();
    });

    it("saveOnLeave should catch and log error", async () => {
      console.log = vi.fn();
      vi.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
        throw new Error("mock error");
      });
      await vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    })
  })
})
