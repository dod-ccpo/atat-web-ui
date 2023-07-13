import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import ConflictOfInterest from "@/steps/07-OtherContractConsiderations/ConflictOfInterest.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(validators);

describe("Testing Conflict of Interest Page", () => {
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();

    wrapper = mount(ConflictOfInterest, {
      vuetify,
      localVue,
    });
  });

  describe("testing Conflict of Interest Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("opens slideout panel on click", async () => {
      const openSlideoutPanelSpy = jest
        .spyOn(wrapper.vm, 'openSlideoutPanel');
      wrapper.find('#CoILearnMore').trigger('keydown.enter');
      expect(openSlideoutPanelSpy).toHaveBeenCalled();
    });

    it("changes explanation when hasConflict changes to 'NO'", async () => {
      wrapper.setData({ hasConflict: 'YES', explanation: 'Test explanation' });
      await wrapper.vm.$nextTick();
      wrapper.setData({ hasConflict: 'NO' });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.explanation).toBe('');
    });

    it("saves data on leave when data has changed", async () => {
      AcquisitionPackage.saveData = jest.fn();
      const saveOnLeaveSpy = jest.spyOn(wrapper.vm, 'saveOnLeave');
      const isChangedSpy = jest
        .spyOn(wrapper.vm, 'isChanged').mockReturnValue(true);
      await wrapper.vm.saveOnLeave();
      expect(isChangedSpy).toHaveBeenCalled();
      expect(saveOnLeaveSpy).toHaveBeenCalled();
    });

    it("loads data on enter", async () => {
      AcquisitionPackage.loadData = jest.fn().mockReturnValue(true);
      const loadOnEnterSpy = jest.spyOn(wrapper.vm, 'loadOnEnter');
      await wrapper.vm.loadOnEnter();
      expect(loadOnEnterSpy).toHaveBeenCalled();
    });

    it("saveOnLeave should catch and log error", async () => {
      console.log = jest.fn();
      jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
        throw new Error("mock error");
      });
      await wrapper.vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    })
  })
})
