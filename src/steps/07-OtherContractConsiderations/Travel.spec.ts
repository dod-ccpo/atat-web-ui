/* eslint-disable camelcase */

import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import Travel from "@/steps/07-OtherContractConsiderations/Travel.vue";
import DescriptionOfWork from "@/store/descriptionOfWork";

Vue.use(Vuetify);

describe("Testing Travel Page", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue, Element>;
  let mockRouter;
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

  beforeEach(() => {
    vuetify = new Vuetify();
    mockRouter = {
      push: jest.fn().mockRejectedValue('Error')
    }
    wrapper = mount(Travel, {
      vuetify,
      localVue,
      mocks: { $router: mockRouter }
    });
  });

  describe("testing Travel Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    it("retrieves correct value from hasListings", async () => {
      expect(wrapper.vm.hasListings).toBe(false);
      await wrapper.setData({tableData: ["test"]});
      expect(wrapper.vm.hasListings).toBe(true);
    });

    it("sets table headers correctly", async () => {
      expect(wrapper.vm.setTableHeaders).toStrictEqual([]);
      await wrapper.setData({tableData: ["test"]});
      expect(wrapper.vm.setTableHeaders).toHaveLength(7);
    });

    it("shows delete all modal if trips exist", async () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      wrapper.vm.confirmDeleteModal = jest.fn();
      await wrapper.setData({isLoading: false});

      wrapper.vm.showDeleteAllModal(true);
      expect(mockRouter.push).toHaveBeenCalled();

      await wrapper.setData({tableData: ["test"]});

      wrapper.vm.showDeleteAllModal(true);
      expect(wrapper.vm.confirmDeleteModal).toHaveBeenCalled();
    });

    it("does not show delete all modal if trips don't exist", async () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      wrapper.vm.showDeleteAllModal(false);
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalledWith(false);
    });

    it("successfully creates new travel summary table data instance", async () => {
      const instance = wrapper.vm.createInstance();
      expect(instance).toStrictEqual(testTravelItem);
    });

    it("successfully cancels dialog", () => {
      wrapper.vm.cancelDialog();
      expect(wrapper.vm.$data.showTravelFormDialog).toBe(false);
      expect(wrapper.vm.$data.travelItem).toStrictEqual(testTravelItem);
    })

    it("successfully edits travel instance", () => {
      wrapper.vm.editInstance(testTravelItemEdited);
      expect(wrapper.vm.$data.isCreate).toBe(false);
      expect(wrapper.vm.$data.showTravelFormDialog).toBe(true);
      expect(wrapper.vm.$data.travelItem).toStrictEqual(testTravelItemEdited);
    });

    it("successfully copies travel instance", () => {
      wrapper.vm.copyInstance(testTravelItem);
      expect(wrapper.vm.$data.tableData).toHaveLength(1);
    });

    it("constructs confirmDeleteModal for a delete all request", () => {
      jest.spyOn(wrapper.vm, "deleteAll", "get").mockReturnValue(true);
      wrapper.vm.confirmDeleteModal(testTravelItem);
      expect(wrapper.vm.$data.travelItem).toStrictEqual(testTravelItem);
      expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(true);
      expect(wrapper.vm.$data.deleteInstanceModalTitle).toBe("Delete trips");
    });

    it("constructs confirmDeleteModal for a single delete", () => {
      jest.spyOn(wrapper.vm, "deleteAll", "get").mockReturnValue(false);
      wrapper.setData({travelItem: {
        ...wrapper.vm.$data.travelItem,
        trip_location: "Bahamas"
      }
      });
      wrapper.vm.confirmDeleteModal(wrapper.vm.$data.travelItem);
      expect(wrapper.vm.$data.deleteInstanceModalTitle).toBe("Delete trip to Bahamas?");
    });

    it("successfully deletes all instances if deleteAll is true", async () => {
      jest.spyOn(wrapper.vm, "deleteAll", "get").mockReturnValue(true);
      DescriptionOfWork.deleteTravelAll = jest.fn();
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      await wrapper.vm.deleteInstance();
      expect(DescriptionOfWork.deleteTravelAll).toHaveBeenCalled();
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalled();
      expect(wrapper.vm.$data.tableData).toStrictEqual([]);
      expect(mockRouter.push).toHaveBeenCalled();
    });

    it("successfully deletes single instance if deleteAll is false", async () => {
      jest.spyOn(wrapper.vm, "deleteAll", "get").mockReturnValue(false);
      DescriptionOfWork.deleteTravelAll = jest.fn();
      wrapper.vm.$data.tableData.push(wrapper.vm.createInstance());
      await wrapper.setData({
        travelItem: {
          ...wrapper.vm.$data.travelitem,
          sys_id: "1" }
      });
      await wrapper.vm.deleteInstance();
      expect(DescriptionOfWork.deleteTravelAll).toHaveBeenCalled();
      expect(wrapper.vm.$data.tableData).toStrictEqual([]);
    });

    it("successfully deletes single instance if deleteAll is false with multiple instances",
      async () => {
        jest.spyOn(wrapper.vm, "deleteAll", "get").mockReturnValue(false);
        DescriptionOfWork.deleteTravelInstance = jest.fn();
        wrapper.vm.$data.tableData.push(wrapper.vm.createInstance(), wrapper.vm.createInstance());
        await wrapper.setData({
          travelItem: {
            ...wrapper.vm.$data.travelitem,
            sys_id: "1" }
        });
        await wrapper.vm.deleteInstance();
        expect(DescriptionOfWork.deleteTravelInstance).toHaveBeenCalled();
      });

    it("successfully cancels delete modal", () => {
      DescriptionOfWork.setConfirmTravelDeleteAll = jest.fn();
      wrapper.vm.cancelDeleteModal();
      expect(wrapper.vm.$data.showDeleteInstanceDialog).toBe(false);
      expect(DescriptionOfWork.setConfirmTravelDeleteAll).toHaveBeenCalled();
    });

    it("successfully adds travel item to table", () => {
      wrapper.setData({ isCreate: true });
      wrapper.vm.addTravelItemToTable();
      expect(wrapper.vm.$data.tableData).toStrictEqual([testTravelItemEdited]);
    });

    it("creates correct text based on period checkbox items", () => {
      wrapper.setData({
        travelItem: {
          ...wrapper.vm.$data.travelItem,
          selected_periods: ["BASE PERIOD", "OPTION PERIOD"]
        },
        availablePeriodCheckboxItems: [
          { label: "Base period", id: "BASE", value: "BASE PERIOD" },
          { label: "Option period 1", id: "OPTION1", value: "OPTION PERIOD" }
        ]
      });
      const periodText = wrapper.vm.createPeriodText(wrapper.vm.$data.travelItem.selected_periods);
      expect(periodText).toBe("Base, OP1");
    });

    it("creates correct text based on period checkbox with no matching items", () => {
      wrapper.setData({
        travelItem: {
          ...wrapper.vm.$data.travelItem,
          selected_periods: ["BASE PERIOD", "OPTION PERIOD"]
        }
      });
      const periodText = wrapper.vm.createPeriodText(wrapper.vm.$data.travelItem.selected_periods);
      expect(periodText).toBe(", ");
    });

    it("creates number of trips text correctly", () => {
      wrapper.setData({travelItem: {
        ...wrapper.vm.$data.travelItem,
        number_of_trips: "1",
        selected_periods: [ "BASE PERIOD" ]
      }
      });
      let numTripsText = wrapper.vm.createNumberOfTripsTexts(wrapper.vm.$data.travelItem);
      expect(numTripsText).toBe("1 total");

      wrapper.setData({travelItem: {
        ...wrapper.vm.$data.travelItem,
        number_of_trips: "2"
      }
      });
      numTripsText = wrapper.vm.createNumberOfTripsTexts(wrapper.vm.$data.travelItem);
      expect(numTripsText).toBe("2 total (2 per period)");
    });

    it("loads data correctly on page enter", async () => {
      DescriptionOfWork.getTravel = jest.fn();
      DescriptionOfWork.loadTravel = jest.fn();
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.isLoading).toBe(false);
      expect(DescriptionOfWork.getTravel).toHaveBeenCalled();
    });

    it("saves data correctly on page leave", async () => {
      DescriptionOfWork.saveTravel = jest.fn();
      await wrapper.vm.saveOnLeave();
      expect(DescriptionOfWork.saveTravel).toHaveBeenCalledWith(wrapper.vm.$data.tableData);
    });
  })
})
