import Vue from "vue";
import Vuetify from "vuetify";
import {createLocalVue, mount, Wrapper} from "@vue/test-utils";
import {DefaultProps} from "vue/types/options";
import PackagingPackingAndShipping from "@/steps/07-OtherContractConsiderations/PackagingPackingAndShipping.vue";
import validators from "@/plugins/validation";
import AcquisitionPackage, {StoreProperties} from "@/store/acquisitionPackage";
import {ContractConsiderationsDTO, ReferenceColumn} from "@/api/models";

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

    it.only("loads data on mount", async () => {
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
      AcquisitionPackage.loadData = jest.fn().mockReturnValue(contractConsiderations);

      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.selectedOptions)
        .toBe(["CONTRACTOR_PROVIDED", "OTHER", "NONE"]);
      expect(wrapper.vm.$data.otherValueEntered).toBe("testExplanation");
    });

    it("saves data on leave", async () => {
      await wrapper.vm.saveOnLeave();
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