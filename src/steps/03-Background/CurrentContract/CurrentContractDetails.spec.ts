/* eslint-disable camelcase */
import { describe, it, expect, vi} from 'vitest';
import { VueWrapper, shallowMount } from '@vue/test-utils';
//import { DefaultProps } from "vue/types/options";
import Vue from "vue";
import Vuex from "vuex";
import CurrentContractDetails 
  from "@/steps/03-Background/CurrentContract/CurrentContractDetails.vue";
//import validators from "../../../plugins/validation";
import AcquisitionPackage
  from "@/store/acquisitionPackage";
import { CurrentContractDTO } from "@/api/models";

describe("Testing CurrentContractDetails Component", () => {
  const store = new Vuex.Store(AcquisitionPackage)
  const formStub = {
    render: () => { /** do nothing */},
    methods: {
      validate: () => true,
    }
  }

  const startDatePickerStub = {
    render: () => { /** do nothing */},
    methods: {
      validate: () => false,
    },
    ref: {
      "atatDatePicker": Vue
    }

  }

  const expirationDatePickerStub = {
    render: () => { /** do nothing */},
    methods: {
      validate: () => false,
    },
    ref: {
      "atatDatePicker": Vue
    }
  }
  let wrapper = shallowMount(CurrentContractDetails, {
    global: {
      mocks: {
        $store: store, // Assuming you want to provide Vuex store as a mock.
        $router: { push: vi.fn() } // Mocking Vue Router's push method if needed.
      },
      stubs: {
        'v-form': formStub,
        'startDatePicker': startDatePickerStub,
        'expirationDatePicker': expirationDatePickerStub,
      }
    }
  });

  let vm =  (wrapper.vm as typeof wrapper.vm.$options);


  beforeEach(() => {
    wrapper = shallowMount(CurrentContractDetails, {
      global: {
        mocks: {
          $store: store, // Assuming you want to provide Vuex store as a mock.
          $router: { push: vi.fn() } // Mocking Vue Router's push method if needed.
        },
        stubs: {
          'v-form': formStub,
          'startDatePicker': startDatePickerStub,
          'expirationDatePicker': expirationDatePickerStub,
        }
      }
    });

    vm =  (wrapper.vm as typeof wrapper.vm.$options);
  });


  //localVue.use(validators);



  const populatedCurrentContract = {
    currentData: {
      contract_order_start_date: "12/31/2022",
      contract_order_expiration_date: "12/31/2027"
    }
  }

  const emptyCurrentContract = {
    currentData: {
      contract_order_start_date: "",
      contract_order_expiration_date: ""
    }
  }

  const currentContractDTO = {
    instance_number: 1,
    current_contract_exists: "YES",
    incumbent_contractor_name: "incumbent_contractor_name",
    contract_number: "123",
    task_delivery_order_number: "123",
    contract_order_expiration_date: "10/12/2039",
    contract_order_start_date: "10/12/2023",
    competitive_status: "cs",
    business_size: "bs",
    acquisition_package: "123",
    is_valid: true,
    sys_created_by: "me",
    is_current: true,
  }


  afterEach(() => {
    //vm.$data.currentData = null;
    // vm.$data.savedData = null;
    // vm.$data.currentContract = null;
    // vm.$data.currentContracts = [];
  });

  it("renders successfully", async () => {
    expect(wrapper.exists()).toBe(true);
  });

  describe("GETTERS", () => {

    const isCurrent = {
      currentContract: {
        contract_order_start_date: "12/31/2022",
        contract_order_expiration_date: "12/31/2027"
      },
      isCurrent: true
    }
    const isPrevious = {
      currentContract: {
        contract_order_expiration_date: "12/31/2022"
      },
      isCurrent: false
    }

    it("todaysDateISO()=> is an ISO date ", async () => {
      const getterISO = vm.todaysDateISO.split("-");
      expect(getterISO[0]).toHaveLength(4)
      expect(getterISO[1]).toHaveLength(2)
      expect(getterISO[2]).toHaveLength(2)
    });

    it("todaysDateMMDDYYYY()=> returns 10 characters - MM/DD/YYYY ", async () => {
      expect(vm.todaysDateMMDDYYYY).toHaveLength(10);
    });

    it("startDate()=> returns valid date ", async () => {
      wrapper.setData({
        currentContract: {
          contract_order_start_date: "12/31/2022"
        },
      });
      expect(vm.startDate).toEqual("2022-12-31")
    });

    it("startDate()=> returns empty string ", async () => {
      expect(vm.startDate).toEqual("")
    });

    it("expirationDate()=> returns valid date ", async () => {
      wrapper.setData({
        currentContract: {
          contract_order_expiration_date: "12/31/2022"
        },
      });
      expect(vm.expirationDate).toEqual("2022-12-31")
    });

    it("expirationDate()=> returns empty string ", async () => {
      expect(vm.expirationDate).toEqual("")
    });

    it("isDatePickersEmpty() => returns true ", async () => {
      wrapper.setData(emptyCurrentContract);
      expect(vm.isDatePickersEmpty).toEqual(true);
    });

    it("isDatePickersEmpty() => returns false ", async () => {
      await wrapper.setData(populatedCurrentContract);
      expect(vm.isDatePickersEmpty).toBe(false);
    });

    it("isExceptiontoFairOpp() => returns true", async () => {
      expect(vm.isExceptiontoFairOpp).toBe(true);
    })

    it("currentData() => returns currentContract obj", async () => {
      wrapper.setProps(
        {currentContract: isCurrent.currentContract
        });
      expect(vm.currentData)
        .toEqual(vm.$data.currentContract);
    })

    it("currentData() => returns initialCurrentContract()", async () => {
      wrapper.setData({ currentContract: undefined });
      //initialContract will have all empty values;
      await vm.$nextTick();
      expect(vm.currentData.business_size).toBe("");
    })
  })

  describe("FUNCTIONS", () => {
    describe("Testing Error Messages functions()", () => {
      const value = ["Error Message 001"];

      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
      })

      describe("returns custom error message ...", () => {
        beforeEach(() => {
          vi.spyOn(vm, "removeSharedErrorMessages")
          wrapper.setProps(emptyCurrentContract);
        });
        afterEach(() => {
          vi.advanceTimersByTime(3000);
          expect(vm.$data.expirationDPSharedErrorMessages[0])
            .toContain('PoP start and expiration dates');
        })

        it("setStartDateErrorMessages(value)", async () => {
          vm.setStartDateErrorMessages(value)
        })

        it("setExpirationDateErrorMessages(value)", async () => {
          vm.setExpirationDateErrorMessages(value)
        })
      });

      describe("returns `value` param as error message ...", () => {
        beforeEach(() => {
          vi.spyOn(vm, "removeSharedErrorMessages");
          wrapper.setData(populatedCurrentContract);
        });
        afterEach(() => {
          vi.advanceTimersByTime(3000);
          expect(vm.$data.expirationDPSharedErrorMessages[0]).toEqual(value[0]);
        })
        it("setStartDateErrorMessages(value)", async () => {
          vm.setStartDateErrorMessages(value)
        })
        it("setExpirationDateErrorMessages(value)", async () => {
          vm.setExpirationDateErrorMessages(value)
        })
      });
    })
    describe("removeSharedErrorMessages(value)", () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
        vi.clearAllTimers();
      })

      it("validates emptied errorMessages arrays", async () => {
        vm.removeSharedErrorMessages(true)
        vi.advanceTimersByTime(3000);
        expect(vm.$data.startDPSharedErrorMessages).toEqual([]);
        expect(vm.$data.expirationDPSharedErrorMessages).toEqual([]);
      })
    })

    describe("setHeadline()", () => {
      const isCurrent = { isCurrent: true }
      const isPrevious = { isCurrent: false }
      beforeEach(() => {
        wrapper.setProps({
          currentContract: {
            contract_order_expiration_date: "2019-12-31"
          }
        })
      })
      afterEach(() => {
        wrapper.setProps({
          currentContract: currentContractDTO
        })
      })

      it("returns headline with `current` word", async () => {
        wrapper.setProps(isCurrent);
        vm.setHeadline();
        expect(vm.$data.headline).toContain('current');
      });

      it("returns headline with `previous` word", async () => {
        wrapper.setProps(isPrevious);
        vm.setHeadline();
        expect(vm.$data.headline).toContain('previous');
      });
    })


    describe("loadContract()", () => {
      currentContractDTO.instance_number = 1;
      it("returns current contract from contacts in store", async () => {
        wrapper.setProps({ currentContract: currentContractDTO })
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO])
        await vm.loadContract();
        expect(vm.$data.currentContract).toEqual(
          vm.$data.currentContracts[0]
        )
      })

      it("returns new blank contract", async () => {
        currentContractDTO.instance_number = 2;
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO]);
        await vm.loadContract();
        expect(Object.values(vm.$data.currentContract).every(v => v === ""))

      })

      it("ensures $data.isCurrent is set as expected", async () => {
        currentContractDTO.instance_number = 2;
        await AcquisitionPackage.doSetCurrentContracts([currentContractDTO]);
        await vm.loadContract();
        expect(vm.$data.isCurrent).not.toBe(true)
      })
    })

    it("loadOnEnter () => loads existing contract", async () => {
      wrapper.setProps({ currentContract: currentContractDTO })
      await AcquisitionPackage.doSetCurrentContracts([currentContractDTO])
      await vm.loadOnEnter();
      expect(Object.keys(vm.savedData).sort())
        .toEqual(Object.keys(vm.currentContract).sort());
    })

    describe("hasChanged()", () => {
      const currentData = { instance_number: 12 };
      const savedData = { instance_number: 13 };

      it("returns true", async () => {
        await wrapper.setData({ currentData })
        await wrapper.setProps({ savedData })
        const hasChanged = await vm.hasChanged();
        expect(hasChanged).toBe(true)
      })

      it("returns false", async () => {
        
        await wrapper.setProps({currentData, savedData: currentData});
        await wrapper.vm.$nextTick();
        const hasChanged = await vm.hasChanged();
        expect(hasChanged).toBe(false)
      })
    });

    describe("saveOnLeave()", () => {
      const acqPkgId = "12345"
      const currentData = {
        instance_number: 12,
        acquisition_package: acqPkgId
      } as CurrentContractDTO;
      const savedData = { instance_number: 13 };

      beforeEach(() => {
        wrapper.setData({
          currentData,
          savedData,
        })
        AcquisitionPackage.doSetPackageId(acqPkgId);
        vi.useFakeTimers();
      })

      afterEach(() => {
        savedData.instance_number = 1;
        vi.useRealTimers();
        vi.clearAllTimers();

      })


      it("if current and saved data has changed", async () => {
        await vm.saveOnLeave();
        expect(vm.currentData.acquisition_package).toBe(acqPkgId);
      })

      it("if current and saved data and sets $data.isCurrent", async () => {
        wrapper.setProps({
          currentContract: {
            contract_order_expiration_date: "2019-12-31"
          }
        })
        await vm.saveOnLeave();
        expect(vm.$data.isCurrent).toBe(false);
      })

      // it("if current and saved data has changed and NO exception to fair opportunity", async () => {
      //   await AcquisitionPackage.doSetFairOpportunity(
      //     { exception_to_fair_opportunity: "NO_NONE" }
      //   )
      //   const mockFunction = vi.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
      //     .mockImplementation(([currentData]) => Promise.resolve())
      //   await vm.saveOnLeave();
      //   vi.advanceTimersByTime(3000);
      //   expect(mockFunction).toHaveBeenCalled();
      // })

      // it("mocks an error", async () => {
      //   const errMessage = 'error occurred'
      //   const mockFunction = vi.spyOn(AcquisitionPackage, "updateCurrentContractsSNOW")
      //     .mockRejectedValue(errMessage)
      //   const saveOnLeave = await vm.saveOnLeave();
      //   expect(vm.saveOnLeaveError).toBe(errMessage);
      // })
    });

    it("sortDataSource() => sorts data source items based on time created ", async () => {
      const currentContracts = [
        { instance_number: 1, sys_created_on: "10/12/2023" },
        { instance_number: 2, sys_created_on: "10/12/2021" }
      ]
      wrapper.setData({ currentContracts });
      await vm.sortDataSource();
      expect(vm.$data.currentContracts[0].sys_created_on).toBe("10/12/2021");
    })

    it("setMinAndMaxDates() => returns dates as expected ", async () => {
      await vm.setMinAndMaxDates();
      expect(vm.$data.startMinDate).toBe("");
      expect(vm.$data.startMaxDate.substring(0, 4))
        .toBe((new Date()).getFullYear().toString());
      expect(vm.$data.expMinDate).toBe("");
      expect(vm.$data.expMaxDate).toBe("");
    })


  });
});
