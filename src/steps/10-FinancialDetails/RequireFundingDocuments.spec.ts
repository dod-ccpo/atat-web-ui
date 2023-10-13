import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import RFD from "./RequireFundingDocuments.vue";
import { DefaultProps } from "vue/types/options";

Vue.use(Vuetify);

describe("Testing Require Funding Documents component", () => {
  const localVue = createLocalVue();
  localVue.use(validators);

  const vuetify: Vuetify = new Vuetify();
  const wrapper: Wrapper<DefaultProps & Vue, Element> = mount(RFD, {
    localVue,
    vuetify,
  });

  describe("Initialization....", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("Testing GETTERS / Data", () => {
    it("tests init data", () => {
      expect(wrapper.vm.$data.savedRequireFundingSelected).toBe("");
      expect(wrapper.vm.$data.requireFundingSelection).toBe("");
      expect(wrapper.vm.$data.requireFundingOptions).toEqual([
        {
          id: "Yes",
          label: "Yes.",
          value: "YES",
        },
        {
          id: "No",
          label: "No.",
          value: "NO",
        },
      ]);
    });
  });

  describe("Testing FUNCTIONS", () => {
    it("loadOnEnter() => void", async () => {
      expect(await wrapper.vm.loadOnEnter()).toBe(undefined);
    });

    it("saveOnLeave() => void (success)", async () => {
      const setValidateNow = jest
        .spyOn(AcquisitionPackage, "setValidateNow")
        .mockImplementation(() => {
          return Promise.resolve();
        });
      const setRequireFundingDocs = jest
        .spyOn(AcquisitionPackage, "setContractingShopRequireFundingDocuments")
        .mockImplementation(() => {
          return Promise.resolve();
        });

      wrapper.vm.savedRequireFundingSelected = "YES";
      wrapper.vm.requireFundingSelection = "NO";

      expect(await wrapper.vm.saveOnLeave()).toBe(true);
      expect(setValidateNow).toBeCalled();
      expect(setRequireFundingDocs).toBeCalled();
    });

    it("saveOnLeave() => void (fail)", async () => {
      const setValidateNow = jest
        .spyOn(AcquisitionPackage, "setValidateNow")
        .mockImplementation(() => {
          return Promise.resolve();
        });
      const setRequireFundingDocs = jest
        .spyOn(AcquisitionPackage, "setContractingShopRequireFundingDocuments")
        .mockImplementation(() => {
          return Promise.reject();
        });

      wrapper.vm.savedRequireFundingSelected = "YES";
      wrapper.vm.requireFundingSelection = "NO";

      expect(await wrapper.vm.saveOnLeave()).toBe(true);
      expect(setValidateNow).toBeCalled();
      expect(setRequireFundingDocs).toBeCalled();
    });

    describe("hasChanged()", () => {
      it("=> false", async () => {
        wrapper.vm.savedRequireFundingSelected = "";
        wrapper.vm.requireFundingSelection = "";
        expect(await wrapper.vm.hasChanged()).toBe(false);
      });

      it("=> true", async () => {
        wrapper.vm.savedRequireFundingSelected = "YES";
        wrapper.vm.requireFundingSelection = "NO";
        expect(wrapper.vm.hasChanged()).toBe(true);
      });
    });
  });
});
