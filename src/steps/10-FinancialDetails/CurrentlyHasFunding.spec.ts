
/* eslint-disable camelcase */
import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper } from "@vue/test-utils";
import CurrentlyHasFunding from "./CurrentlyHasFunding.vue";
import { DefaultProps } from "vue/types/options";
import * as acqPackageExportedFunctions from "@/store/acquisitionPackage";
import FinancialDetails from "@/store/financialDetails";
import {routeNames} from "@/router/stepper";
import VueRouter, {RawLocation} from "vue-router";

Vue.use(Vuetify);

describe("Testing CurrentlyHasFunding component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
 
  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentlyHasFunding, {
      localVue,
      vuetify,
      mocks: {
        $validators: {
          required: (msg: string) => (value: string) => !!value || msg
        }
      }
    });
  });

  describe("INITIALIZATION", () => {
    it("tests that component renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("FUNCTIONS", () => {
    it("currentData() => should retrieve user selection when getter currentData is called", 
    async () => {
      let selection = wrapper.vm.currentData;
      expect(selection).toBe("");
      await wrapper.setData({ "selectedHasFunding": "NO_FUNDING" });
      await wrapper.vm.$nextTick();
      selection = wrapper.vm.currentData;
      expect(selection).toBe("NO_FUNDING");
    });

    it("loadOnEnter() => should load data correctly on page load", async () => {
      jest.spyOn(FinancialDetails, 'loadFundingRequirement').mockResolvedValue();
      await wrapper.vm.loadOnEnter();

      expect(FinancialDetails.loadFundingRequirement).toHaveBeenCalled();
      expect(wrapper.vm.selectedHasFunding).toBe(FinancialDetails.hasFunding || "");
    });

    it("saveOnLeave() => should save data correctly on page leave", async () => {
      jest.spyOn(FinancialDetails, 'setHasFunding').mockResolvedValue();
      jest.spyOn(FinancialDetails, 'saveFundingRequirement').mockResolvedValue();

      wrapper.setData({ selectedHasFunding: "HAS_FUNDING" });

      await wrapper.vm.saveOnLeave();

      expect(FinancialDetails.setHasFunding).toHaveBeenCalledWith("HAS_FUNDING");
      expect(FinancialDetails.saveFundingRequirement).toHaveBeenCalled();
    });

    it("saveOnLeave() => should throw if data does not save on page leave", async () => {
      jest.spyOn(wrapper.vm, 'hasChanged').mockReturnValue(true);
      jest.spyOn(FinancialDetails, 'setHasFunding')
        .mockImplementation(() => {throw new Error("Mock error")});
      console.log = jest.fn();

      await wrapper.vm.saveOnLeave();

      expect(console.log).toHaveBeenCalledWith(new Error("Mock error"));
    });

    it("addNavigation() => should navigate to RFD page if non-DITCO user", () => {
      jest.spyOn(acqPackageExportedFunctions, "isDitcoUser").mockReturnValue(false);
      const pushMock = jest.fn();
      wrapper.vm.$router = { push: pushMock as RawLocation } as VueRouter;
      wrapper.vm.addNavigation();
      expect(pushMock).toHaveBeenCalledWith({
        name: routeNames.RFD,
      });
    });
  });
});


