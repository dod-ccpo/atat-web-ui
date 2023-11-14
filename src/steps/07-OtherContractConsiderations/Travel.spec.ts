/* eslint-disable camelcase */

import { describe, it, expect} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import Travel from "@/steps/07-OtherContractConsiderations/Travel.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";

const wrapper: VueWrapper = shallowMount(DescriptionOfWork, {
  global: {
    mocks: {
      $router: {
        push: vi.fn()
      }
    }
  }
} );
const vm =  (wrapper.vm as typeof wrapper.vm.$options)

describe("Testing Travel Page", () => {
  const testTravelItem = {
    instanceNumber: 0,
    trip_location: "",
    duration_in_days: "",
    number_of_travelers: "",
    number_of_trips: "",
    selected_periods: [],
  }
  const testTravelItemEdited = {
    instanceNumber: 1,
    trip_location: "",
    duration_in_days: "",
    number_of_travelers: "",
    number_of_trips: "",
    selected_periods: [],
  }


  describe("testing Travel Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("retrieves correct value from hasListings", async () => {
      expect(vm.hasListings).toBe(false);
      await wrapper.setData({tableData: ["test"]});
      expect(vm.hasListings).toBe(true);
    });

    it("sets table headers correctly", async () => {
      expect(vm.setTableHeaders).toStrictEqual([]);
      await wrapper.setData({tableData: ["test"]});
      expect(vm.setTableHeaders).toHaveLength(7);
    });

    it("shows delete all modal if trips exist", async () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      vm.confirmDeleteModal = jest.fn();
      await wrapper.setData({isLoading: false});

      vm.showDeleteAllModal(true);
      expect(vm.$router.push).toHaveBeenCalled();

      await wrapper.setData({tableData: ["test"]});

      vm.showDeleteAllModal(true);
      expect(vm.confirmDeleteModal).toHaveBeenCalled();
    });

    it("does not show delete all modal if trips don't exist", async () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      vm.showDeleteAllModal(false);
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalledWith(false);
    });

    it("successfully creates new travel summary table data instance", async () => {
      const instance = vm.createInstance();
      expect(instance).toStrictEqual(testTravelItem);
    });

    it("successfully cancels dialog", () => {
      vm.cancelDialog();
      expect(vm.$data.showTravelFormDialog).toBe(false);
      expect(vm.$data.travelItem).toStrictEqual(testTravelItem);
    })

    it("successfully edits travel instance", () => {
      vm.editInstance(testTravelItemEdited);
      expect(vm.$data.isCreate).toBe(false);
      expect(vm.$data.showTravelFormDialog).toBe(true);
      expect(vm.$data.travelItem).toStrictEqual(testTravelItemEdited);
    });

    it("successfully copies travel instance", () => {
      vm.copyInstance(testTravelItem);
      expect(vm.$data.tableData).toHaveLength(1);
    });

    it("constructs confirmDeleteModal for a delete all request", () => {
      jest.spyOn(vm, "deleteAll", "get").mockReturnValue(true);
      vm.confirmDeleteModal(testTravelItem);
      expect(vm.$data.travelItem).toStrictEqual(testTravelItem);
      expect(vm.$data.showDeleteInstanceDialog).toBe(true);
      expect(vm.$data.deleteInstanceModalTitle).toBe("Delete trips");
    });

    it("constructs confirmDeleteModal for a single delete", () => {
      jest.spyOn(vm, "deleteAll", "get").mockReturnValue(false);
      wrapper.setData({travelItem: {
        ...vm.$data.travelItem,
        trip_location: "Bahamas"
      }
      });
      vm.confirmDeleteModal(vm.$data.travelItem);
      expect(vm.$data.deleteInstanceModalTitle).toBe("Delete trip to Bahamas?");
    });

    it("successfully deletes all instances if deleteAll is true", async () => {
      jest.spyOn(vm, "deleteAll", "get").mockReturnValue(true);
      DescriptionOfWork.deleteTravelAll = jest.fn();
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      await vm.deleteInstance();
      expect(DescriptionOfWork.deleteTravelAll).toHaveBeenCalled();
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalled();
      expect(vm.$data.tableData).toStrictEqual([]);
      expect(vm.$router.push).toHaveBeenCalled();
    });

    it("successfully deletes single instance if deleteAll is false", async () => {
      jest.spyOn(vm, "deleteAll", "get").mockReturnValue(false);
      DescriptionOfWork.deleteTravelAll = jest.fn();
      vm.$data.tableData.push(vm.createInstance());
      await wrapper.setData({
        travelItem: {
          ...vm.$data.travelitem,
          sys_id: "1" }
      });
      await vm.deleteInstance();
      expect(DescriptionOfWork.deleteTravelAll).toHaveBeenCalled();
      expect(vm.$data.tableData).toStrictEqual([]);
    });

    it("successfully deletes single instance if deleteAll is false with multiple instances",
      async () => {
        jest.spyOn(vm, "deleteAll", "get").mockReturnValue(false);
        DescriptionOfWork.deleteTravelInstance = jest.fn();
        vm.$data.tableData.push(vm.createInstance(), vm.createInstance());
        await wrapper.setData({
          travelItem: {
            ...vm.$data.travelitem,
            sys_id: "1" }
        });
        await vm.deleteInstance();
        expect(DescriptionOfWork.deleteTravelInstance).toHaveBeenCalled();
      });

    it("successfully cancels delete modal", () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      vm.cancelDeleteModal();
      expect(vm.$data.showDeleteInstanceDialog).toBe(false);
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalled();
    });

    it("successfully adds travel item to table", () => {
      wrapper.setData({ isCreate: true });
      vm.addTravelItemToTable();
      expect(vm.$data.tableData).toStrictEqual([testTravelItemEdited]);
    });

    it("creates correct text based on period checkbox items", () => {
      wrapper.setData({
        travelItem: {
          ...vm.$data.travelItem,
          selected_periods: ["BASE PERIOD", "OPTION PERIOD"]
        },
        availablePeriodCheckboxItems: [
          { label: "Base period", id: "BASE", value: "BASE PERIOD" },
          { label: "Option period 1", id: "OPTION1", value: "OPTION PERIOD" }
        ]
      });
      const periodText = vm.createPeriodText(vm.$data.travelItem.selected_periods);
      expect(periodText).toBe("Base, OP1");
    });

    it("creates correct text based on period checkbox with no matching items", () => {
      wrapper.setData({
        travelItem: {
          ...vm.$data.travelItem,
          selected_periods: ["BASE PERIOD", "OPTION PERIOD"]
        }
      });
      const periodText = vm.createPeriodText(vm.$data.travelItem.selected_periods);
      expect(periodText).toBe(", ");
    });

    it("creates number of trips text correctly", () => {
      wrapper.setData({travelItem: {
        ...vm.$data.travelItem,
        number_of_trips: "1",
        selected_periods: [ "BASE PERIOD" ]
      }
      });
      let numTripsText = vm.createNumberOfTripsTexts(vm.$data.travelItem);
      expect(numTripsText).toBe("1 total");

      wrapper.setData({travelItem: {
        ...vm.$data.travelItem,
        number_of_trips: "2"
      }
      });
      numTripsText = vm.createNumberOfTripsTexts(vm.$data.travelItem);
      expect(numTripsText).toBe("2 total (2 per period)");
    });

    it("loads data correctly on page enter", async () => {
      DescriptionOfWork.getTravel = jest.fn();
      DescriptionOfWork.loadTravel = jest.fn();
      await vm.loadOnEnter();
      expect(vm.$data.isLoading).toBe(false);
      expect(DescriptionOfWork.getTravel).toHaveBeenCalled();
    });

    it("saves data correctly on page leave", async () => {
      DescriptionOfWork.saveTravel = jest.fn();
      await vm.saveOnLeave();
      expect(DescriptionOfWork.saveTravel).toHaveBeenCalledWith(vm.$data.tableData);
    });
  })
})
