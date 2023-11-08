/* eslint-disable camelcase */
import { describe, it, expect } from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils'
import SummaryStepOne from "@/steps/01-AcquisitionPackageDetails/SummaryStepOne.vue";
import Summary, * as SummaryExportedFunctions from "@/store/summary";
import { createStore } from 'vuex';
import AcquisitionPackage from '@/store/acquisitionPackage';
import { OrganizationDTO } from '@/api/models';

describe("Testing SummaryStepOne Component", () => {
  const actions = {
    initialize: vi.fn().mockResolvedValue(Promise.resolve()),
    setInitialized: vi.fn().mockReturnValue(true),
    initialOrganization: vi.fn().mockReturnValue({
      acquisition_package: "",
      country: "",
      address_type: "",
      city: "",
      dodaac: "",
      street_address_1: "",
      street_address_2: "",
      zip_code: "",
      sys_id: "",
      disa_organization: "HaCC",
      organization_name: "",
      agency: "DISA",
      state: "",
      disa_organization_reference: {
        link: 'abc123',
        value: 'sys_id'
      }
    })
  } 
  const mockStore = createStore({
    modules: {
      OrganizationData: {
        namespaced: true,
        actions
      }
    }
  })
  const wrapper: VueWrapper = shallowMount(SummaryStepOne, {
    props: {

    },
    global: {
      plugins: [mockStore]
    }
  })

  const vm =  (wrapper.vm as typeof wrapper.vm.$options)
  
 
  AcquisitionPackage.setOrganization(actions.initialOrganization as OrganizationDTO)
  

  describe("testing SummaryStepOne render", () => {

    it("renders successfully", async () => {
      expect(wrapper.exists()).toBe(true);
    });
  });

  describe("GETTERS", () => {
    describe("introParagraph()=> ", () => {
      it("returns `We need some more details` statement", async () => {
        vi
          .spyOn(SummaryExportedFunctions, "isStepComplete")
          .mockReturnValueOnce(false);
        vm.setIntroParagraph();
        expect(vm.$data.introParagraph).toContain(
          "We need some more details"
        );
      });
      it("returns `You are all done` statement", async () => {
        vi
          .spyOn(SummaryExportedFunctions, "isStepComplete")
          .mockReturnValueOnce(true);
        vm.setIntroParagraph();
        expect(vm.$data.introParagraph).toContain("You are all done");
      });
    });
  });

  describe("FUNCTIONS", () => {
    it("saveOnLeave()=> expect function to be called", async () => {
      const toggleButtonColorMock = vi
        .spyOn(Summary, "toggleButtonColor")
        .mockImplementation(() => Promise.resolve());
      await vm.saveOnLeave();
      expect(toggleButtonColorMock).toHaveBeenCalled();
    });
  });
});
