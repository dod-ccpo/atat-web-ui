/* eslint-disable camelcase */
import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
import CurrentContract 
  from "@/steps/03-Background/CurrentContract/CurrentContract.vue";
import AcquisitionPackage from "@/store/acquisitionPackage";

describe("Testing CurrentContract Component", () => {
  

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


  const wrapper: VueWrapper = shallowMount(CurrentContract, {
    global: {
      mocks: {
        $router: {
          push: vi.fn()
        }
      }
    }
  });
  const vm =  (wrapper.vm as typeof wrapper.vm.$options);
  


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
      expect(vm.currentData.current_contract_exists).toBe(currentContractExists);
      expect(vm.currentData.acquisition_package).toBe(
        acqPkgId
      )
    })
    
    it("hasExceptionToFairOpportunity() => returns boolean", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO);
      expect(vm.hasExceptionToFairOpportunity).toBe(false);
    })
    
    it("getHeadline() => returns headline WITHOUT `previous`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO);
      expect(vm.getHeadline).not.toContain(`previous`);
    })
    
    it("getHeadline() => returns headline WITH `previous`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO)
      expect(vm.getHeadline).toContain(`previous`);
    })
    
    it("getLeadParagraph() => returns lead paragraph WITHOUT `contract(s)`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasNoEFO)
      expect(vm.getLeadParagraph).not.toContain(`contract(s)`);
    })

    it("getLeadParagraph() => returns lead paragraph WITH `contract(s)`", async()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO)
      expect(vm.getLeadParagraph).toContain(`contract(s)`);
    })
  })
  
  describe("FUNCTIONS =>", ()=>{
    beforeEach(async ()=>{
      await AcquisitionPackage.doSetFairOpportunity(hasEFO);
    })

    describe("addNavigation() =>", ()=>{
      it("mocks route as expected", async()=>{
        await vm.addNavigation();
        expect(vm.$router.push).toHaveBeenCalledWith({
          name: "Procurement_History_Summary",
        });
      })

      it("loadOnEnter() => sets data attributes as expected", async()=>{
        const hasCurrentOrPreviousContracts = "YES";
        await AcquisitionPackage.doSetHasCurrentOrPreviousContracts(
          hasCurrentOrPreviousContracts
        )
        await vm.loadOnEnter();
        expect(vm.$data.currentContractExists).toBe(hasCurrentOrPreviousContracts);
      })

      it("hasChanged() => returns boolean", async()=>{
        wrapper.setData(hasChanged);
        expect(vm.hasChanged()).toBe(true);
      })

      describe("saveOnLeave()=>", ()=>{
        beforeEach(()=>{
          vi.spyOn(AcquisitionPackage, "setHasCurrentOrPreviousContracts")
            .mockImplementation(()=>Promise.resolve())
          vi.spyOn(AcquisitionPackage, "clearCurrentContractInfo")
            .mockImplementation(()=>Promise.resolve())
       
          wrapper.setData(hasChanged);
        })
        it("returns true", async()=>{
          expect(await vm.saveOnLeave()).toBe(true);
        });
      
        it ("successfully returns an error", async()=>{
          const errorMessage = "saveOnLeave Error Message"
          vi.spyOn(AcquisitionPackage, "clearCurrentContractInfo")
            .mockRejectedValue(errorMessage)
          await vm.saveOnLeave();
          expect(vm.$data.saveOnLeaveError).toBe(errorMessage);
        });
      
        it ("initializes a current contract as expected if current_contract_exists==='NO'",
          async()=>{
            await vm.saveOnLeave();
            expect(vm.$data.noContract.current_contract_exists).toEqual("NO");
            expect(vm.$data.noContract.instance_number).toEqual(0);
          });

        it ("initializes a current contract as expected if current_contract_exists==='NO'" +
        "&& expects function to be called",
        async()=>{
          const updateCurrentContractsSNOWMock = 
          vi.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
            .mockImplementation(()=>Promise.resolve())
          await vm.saveOnLeave();
          expect(updateCurrentContractsSNOWMock).toHaveBeenCalled();
          expect(vm.$data.noContract).toEqual({});
        });

      })
    })

  
  });
})
