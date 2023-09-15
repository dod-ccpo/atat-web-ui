/* eslint-disable camelcase */
import { createLocalVue, mount, Wrapper } from "@vue/test-utils";
import Vuetify from "vuetify";
import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import validators from "../../../plugins/validation";
import CurrentContract 
  from "@/steps/03-Background/CurrentContract/CurrentContract.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";
import * as ResolverExportedFunctions from "../../../router/resolvers/index";

describe("Testing CurrentContract Component", () => {
  const localVue = createLocalVue();
  let vuetify: Vuetify;
  let wrapper: Wrapper<DefaultProps & Vue>;
  localVue.use(validators);

  // object to determine an exception to fair opportunity
  const hasEFO =  {exception_to_fair_opportunity: "YES_FAR_16_505_B_2_I_C"};
  // object to determine NO exception to fair opportunity
  const hasNoEFO = {exception_to_fair_opportunity: "NO_NONE"};
  // object to determine EMPTY exception to fair opportunity
  const hasEmptyEFO = {exception_to_fair_opportunity: ""};
  // determines true for `hasChanged` function
  const hasChanged =  {
    currentContractExists: "NO",
    savedData:{ current_contract_exists: "YES" }
  }

  const mockRoute = {
    name: "Current_Contract_Details",
    params: {
      id: 1
    }
  }
  const mockRouter = {
    push: jest.fn(),
  }
  

  beforeEach(() => {
    vuetify = new Vuetify();
    wrapper = mount(CurrentContract, {
      localVue,
      vuetify,
      mocks: {
        $route: mockRoute,
        $router: mockRouter
      }
    });

  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });
  
  describe("GETTERS =>", ()=>{
    
    afterEach(async ()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEmptyEFO);
      AcquisitionPackage.doSetPackageId("");
    })
    it("currentData() => return valid CurrentContractDTO", async()=>{
      const currentContractExists = true;
      const acqPkgId = "1"
      AcquisitionPackage.doSetPackageId(acqPkgId);
      wrapper.setData(
        {currentContractExists}
      )
      expect(wrapper.vm.currentData.current_contract_exists).toBe(currentContractExists);
      expect(wrapper.vm.currentData.acquisition_package).toBe(
        acqPkgId
      )
    })
    
    it("hasExceptionToFairOpportunity() => returns boolean", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO);
      expect(wrapper.vm.hasExceptionToFairOpportunity).toBe(false);
    })
    
    it("getHeadline() => returns headline WITHOUT `previous`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO);
      expect(wrapper.vm.getHeadline).not.toContain(`previous`);
    })
    
    it("getHeadline() => returns headline WITH `previous`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO)
      expect(wrapper.vm.getHeadline).toContain(`previous`);
    })
    
    it("getLeadParagraph() => returns lead paragraph WITHOUT `contract(s)`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO)
      expect(wrapper.vm.getLeadParagraph).not.toContain(`contract(s)`);
    })

    it("getLeadParagraph() => returns lead paragraph WITH `contract(s)`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO)
      expect(wrapper.vm.getLeadParagraph).toContain(`contract(s)`);
    })
  })
  
  describe("FUNCTIONS =>", ()=>{
    beforeEach(async ()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO);
    })

    describe("addNavigation() =>", ()=>{
      it("mocks route as expected", async()=>{
        jest.spyOn(ResolverExportedFunctions, "CurrentContractRouteResolver")
          .mockReturnValue(mockRoute.name)
        await wrapper.vm.addNavigation();
        expect(mockRouter.push).toHaveBeenCalledWith({
          "name":  mockRoute.name,
        });
      })
    })

    it("loadOnEnter() => sets data attributes as expected", async()=>{
      const hasCurrentOrPreviousContracts = "YES";
      await AcquisitionPackage.doSetHasCurrentOrPreviousContracts(
        hasCurrentOrPreviousContracts
      )
      await wrapper.vm.loadOnEnter();
      expect(wrapper.vm.$data.currentContractExists).toBe(hasCurrentOrPreviousContracts);
    })

    it("hasChanged() => returns boolean", async()=>{
      wrapper.setData(hasChanged);
      expect(wrapper.vm.hasChanged()).toBe(true);
    })

    describe("saveOnLeave()=>", ()=>{
      beforeEach(()=>{
        jest.spyOn(AcquisitionPackage, "setHasCurrentOrPreviousContracts")
          .mockImplementation(()=>Promise.resolve())
        jest.spyOn(AcquisitionPackage, "clearCurrentContractInfo")
          .mockImplementation(()=>Promise.resolve())
       
        wrapper.setData(hasChanged);
      })
      it("returns true", async()=>{
        expect(await wrapper.vm.saveOnLeave()).toBe(true);
      });
      
      it ("successfully returns an error", async()=>{
        const errorMessage = "saveOnLeave Error Message"
        jest.spyOn(AcquisitionPackage, "clearCurrentContractInfo")
          .mockRejectedValue(errorMessage)
        await wrapper.vm.saveOnLeave();
        expect(wrapper.vm.$data.saveOnLeaveError).toBe(errorMessage);
      });
      
      it ("initializes a current contract as expected if current_contract_exists==='NO'",
        async()=>{
          await wrapper.vm.saveOnLeave();
          expect(wrapper.vm.$data.noContract.current_contract_exists).toEqual("NO");
          expect(wrapper.vm.$data.noContract.instance_number).toEqual(0);
        });

      it ("initializes a current contract as expected if current_contract_exists==='NO'" +
        "&& expects function to be called",
      async()=>{
        const updateCurrentContractsSNOWMock = 
          jest.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
            .mockImplementation(()=>Promise.resolve())
        await wrapper.vm.saveOnLeave();
        expect(updateCurrentContractsSNOWMock).toHaveBeenCalled();
        expect(wrapper.vm.$data.noContract).toEqual({});
      });

    })
  })

  
});
