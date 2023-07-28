import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import BAA from "./BAA.vue";
import validators from "@/plugins/validation";
import SlideoutPanel from "@/store/slideoutPanel";
import AcquisitionPackage from "@/store/acquisitionPackage";

Vue.use(Vuetify);

describe("Testing BAA Page", () => {
  const localVue = createLocalVue();
  localVue.use(validators);
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(BAA, {
      vuetify,
      localVue,
    });
  });

  describe("testing BAA.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("opens slideout panel", () => {
      jest.spyOn(SlideoutPanel, "openSlideoutPanel").mockImplementation();
      const currentTargetId = 1;
      wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
      expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
        currentTargetId
      );
    });

    // it("testing @keydown.space to trigger openSlideoutPanel ", async () => {
    //   const anchorLink = wrapper.find("#LearnMoreBAA");
    //   anchorLink.trigger('keydown.space'); // trigger openSlideoutPanel;
    //   const currentTargetId = 1;
    //   wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
    //   expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
    //     currentTargetId
    //   );
    // });

    // it("testing @keydown.enter to trigger openSlideoutPanel ", async () => {
    //   const anchorLink = wrapper.find("#LearnMoreBAA");
    //   anchorLink.trigger('keydown.enter'); // trigger openSlideoutPanel;
    //   const currentTargetId = 1;
    //   wrapper.vm.openSlideoutPanel({ currentTarget: { id: currentTargetId } });
    //   expect(SlideoutPanel.openSlideoutPanel).toHaveBeenCalledWith(
    //     currentTargetId
    //   );
    // });

    it("gets current data", () => {
      const mockPackageId = "1";
      AcquisitionPackage.doSetPackageId(mockPackageId)
      const currentData = wrapper.vm.currentData;
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
      const hasChanges = wrapper.vm.hasChanged()
      expect(hasChanges).toBe(true)
    })

    it("checks saveOnLeave", async () =>{
      const hasChanges = await wrapper.vm.saveOnLeave()
      expect(hasChanges).toBe(true)
    })
  });
});
