/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import { DefaultProps } from "vue/types/options";
import AcquisitionPackage from "@/store/acquisitionPackage";
import Section508Standards from "./Section508Standards.vue";

Vue.use(Vuetify);

describe("Testing Section508Standards Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  const mockValidator = {
    required: jest.fn()
  };

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(Section508Standards, {
      vuetify,
      localVue,
      mocks: {
        $validators: mockValidator
      }
    });
  });

  describe("testing Section508Standards.vue", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe("testing getters", () => {
      it("should correctly return currentData", () => {
        const mockData = {
          section_508_sufficient: "YES"
        };
        wrapper.vm.selected508Response = mockData.section_508_sufficient;
        expect(wrapper.vm.currentData).toEqual(mockData);
      });
    });

    describe("testing business functions", () => {
      it("radioButtonSelected should update accessibility_reqs_508 if 'YES' is selected", () => {
        (wrapper.vm as any).radioButtonSelected('YES');
        expect((wrapper.vm as any).currentData.accessibility_reqs_508).toBe("");
      });

      it("hasChanged should return false when currentData matches savedData", () => {
        const mockData = {
          section_508_sufficient: "YES"
        };
        (wrapper.vm as any).savedData = mockData;
        (wrapper.vm as any).selected508Response = mockData.section_508_sufficient;
        expect((wrapper.vm as any).hasChanged()).toBe(false);
      });

      it("hasChanged should return true when currentData doesn't match savedData", () => {
        (wrapper.vm as any).savedData = {
          section_508_sufficient: "NO"
        };
        (wrapper.vm as any).selected508Response = "YES";
        expect((wrapper.vm as any).hasChanged()).toBe(true);
      });

      it("loadOnEnter should load data if any exists", async () => {
        AcquisitionPackage.loadData = jest.fn()
          .mockResolvedValue({ section_508_sufficient: "YES" });

        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.savedData.section_508_sufficient).toBe("YES");
      });

      it("saveOnLeave should save changes to the store if any exist", async () => {
        wrapper.vm.hasChanged = jest.fn().mockReturnValue(true);
        AcquisitionPackage.saveData = jest.fn();

        await wrapper.vm.saveOnLeave();
        expect(AcquisitionPackage.saveData).toHaveBeenCalled();
      });

      it("saveOnLeave should log error if saveData fails", async () => {
        console.log = jest.fn();
        wrapper.vm.hasChanged = jest.fn().mockReturnValue(true);
        AcquisitionPackage.saveData = jest.fn().mockImplementation(
          () => { throw new Error("mock error") }
        );

        await wrapper.vm.saveOnLeave();
        expect(console.log).toHaveBeenCalledWith(Error("mock error"));
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
