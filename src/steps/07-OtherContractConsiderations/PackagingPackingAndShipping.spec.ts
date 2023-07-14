import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import PackagingPackingAndShipping from "@/steps/07-OtherContractConsiderations/PackagingPackingAndShipping.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage from "@/store/acquisitionPackage";
import {ContractConsiderationsDTO} from "@/api/models";

Vue.use(Vuetify);

const localVue = createLocalVue();
localVue.use(validators);

describe("Testing Packaging, Packing, and Shipping Page", () => {
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;

  beforeEach(() => {
    vuetify = new Vuetify();

    wrapper = mount(PackagingPackingAndShipping, {
      vuetify,
      localVue,
    });
  });

  describe("Testing Packaging, Packing, and Shipping Page", () => {
    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });

    describe("loadOnEnter()", () => {
      const contractConsiderations: ContractConsiderationsDTO = {
        packaging_shipping_other: "true",
        contractor_required_training: "",
        packaging_shipping_other_explanation: "testExplanation",
        conflict_of_interest_explanation: "",
        potential_conflict_of_interest: "",
        required_training_courses: "",
        packaging_shipping_none_apply: "true",
        contractor_provided_transfer: "true",
        acquisition_package: ""
      }


      it("sets $data attributes as expected", async () => {
        jest.spyOn(AcquisitionPackage, "loadData").mockReturnValue(contractConsiderations);
        await wrapper.vm.loadOnEnter();
        expect(wrapper.vm.$data.savedData.contractor_provided_transfer).toBe("true");
        expect(wrapper.vm.$data.selectedOptions.length).toBeGreaterThan(0);
      });

      it("calls store function as expected", async () => {
        jest.spyOn(AcquisitionPackage, "loadData").mockReturnValue(null);
        const setCurrentContractMock = jest
          .spyOn(AcquisitionPackage, "setCurrentContract").mockImplementation();
        await wrapper.vm.loadOnEnter();
        expect(setCurrentContractMock).toHaveBeenCalled();
      });

      describe("accommodates ternaries ", () => {
        const contractConsiderationsWithFalse: ContractConsiderationsDTO = {
          packaging_shipping_other: "false",
          contractor_required_training: "",
          packaging_shipping_other_explanation: "testExplanation",
          conflict_of_interest_explanation: "",
          potential_conflict_of_interest: "",
          required_training_courses: "",
          packaging_shipping_none_apply: "false",
          contractor_provided_transfer: "false",
          acquisition_package: ""
        }
        beforeEach(()=>{
          jest.spyOn(AcquisitionPackage, "loadData")
            .mockReturnValue(contractConsiderationsWithFalse);
        })
        it("sets wrapper.vm.$data as expected", async () => {
          await wrapper.vm.loadOnEnter();
          expect(wrapper.vm.$data.otherValueEntered).toBe("testExplanation")
        });
      });
    });

    it("saves data on leave when data has changed", async () => {
      AcquisitionPackage.saveData = jest.fn();
      AcquisitionPackage.setValidateNow = jest.fn();
      wrapper.setData({noneApplySelected: "true"});
      const saveOnLeaveSpy = jest.spyOn(wrapper.vm, 'saveOnLeave');
      const isChangedSpy = jest
        .spyOn(wrapper.vm, 'isChanged').mockReturnValue(true);
      await wrapper.vm.saveOnLeave();
      expect(wrapper.vm.$data.otherValueEntered).toBe("");
      expect(isChangedSpy).toHaveBeenCalled();
      expect(saveOnLeaveSpy).toHaveBeenCalled();
    });

    it("saveOnLeave should catch and log error", async () => {
      console.log = jest.fn();
      AcquisitionPackage.setValidateNow = jest.fn();
      jest.spyOn(AcquisitionPackage, 'saveData').mockImplementation(() => {
        throw new Error("mock error");
      });
      await wrapper.vm.saveOnLeave();
      expect(console.log).toHaveBeenCalledWith(Error("mock error"));
    });

    it("updates selected options when they change", async () => {
      wrapper.setData({ selectedOptions: ['CONTRACTOR_PROVIDED'] });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.contractorProvidedTransportSelected).toBe('true');
    });

    it("updates other value entered when other selected", async () => {
      wrapper.setData({ selectedOptions: ['OTHER'], otherValueEntered: 'Custom instructions' });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.otherSelected).toBe('true');
      expect(wrapper.vm.otherValueEntered).toBe('Custom instructions');
    });

    it("updates none apply selected when none apply selected", async () => {
      wrapper.setData({ selectedOptions: ['NONE'] });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.noneApplySelected).toBe('true');
    });

    it("checks if data has changed", async () => {
      wrapper.setData({ selectedOptions: ['CONTRACTOR_PROVIDED'] });
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.isChanged()).toBe(true);
    });
  });
})