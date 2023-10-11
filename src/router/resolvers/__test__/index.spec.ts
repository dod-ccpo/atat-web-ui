/* eslint-disable camelcase */
import {
  OtherOfferingSummaryPathResolver,
  OfferingDetailsPathResolver,
  RequirementsPathResolver,
  ServiceOfferingsPathResolver,
  calcBasePeriod,
  IncrementalFundingResolver,
  FinancialPOCResolver,
  AppropriationOfFundsResolver
} from '../index'
import {FinancialDetailsStore} from "@/store/financialDetails/index";
import DescriptionOfWork from "@/store/descriptionOfWork";
import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";
import FinancialDetails from "@/store/financialDetails";
import { routeNames } from "@/router/stepper";
import { FairOpportunityDTO, FundingRequirementDTO } from "@/api/models";
import { getModule } from "vuex-module-decorators";
import Vuex, { Store } from "vuex";
import AcquisitionPackage from "@/store/acquisitionPackage";
describe("testing src/router/index.ts", () => {
  
  describe('Testing OtherOfferingSummaryPathResolver()', () => {
    it("Test OtherOfferingSummaryPathResolver()- should return the default path", () => {
      const result = OtherOfferingSummaryPathResolver("test", "testing")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OtherOfferingSummaryPathResolver()- should return the performance path", () => {
      const result = OtherOfferingSummaryPathResolver("DOW_Summary", "next")
      expect(result).toBe('performance-requirements')
    })

    it("Test OtherOfferingSummaryPathResolver()- should return the summary path", () => {
      const result = OtherOfferingSummaryPathResolver("Service_Offering_Details", "next")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OtherOfferingSummaryPathResolver()- should return a path for Compute", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
      const result = OtherOfferingSummaryPathResolver("Service_Offering_Details", "next")
      expect(result).toBe("performance-requirements/service-offerings/other/summary");
    })

  })

  describe('Testing OfferingDetailsPathResolver()', () => {
    it("Test OfferingDetailsPathResolver()- should return the default path", () => {
      const result = OfferingDetailsPathResolver("test", "testing")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OfferingDetailsPathResolver()- should return DOW summary path", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      const result = OfferingDetailsPathResolver("Compute_Requirements", "previous")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OfferingDetailsPathResolver()- should return DOW summary path with return set", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setReturnToDOWSummary(true)
      const result = OfferingDetailsPathResolver("Compute_Requirements", "previous")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    // it("Test OfferingDetailsPathResolver()- should change current group offering", () => {
    //   DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
    //   DescriptionOfWork.setReturnToDOWSummary(false)
    //   DescriptionOfWork.setServiceOfferingGroups([
    //     {
    //       name: 'test1',
    //       label: 'Compute',
    //       value: 'COMPUTE',
    //       sequence: 1,
    //     },
    //     {
    //       name: 'test2',
    //       label: 'Applications',
    //       value: 'APPLICATIONS',
    //       sequence: 2,
    //     },
    //   ])
    //   DescriptionOfWork.addOfferingGroup('APPLICATIONS')
    //   DescriptionOfWork.addOfferingGroup('COMPUTE')
    //   const group = DescriptionOfWork.prevOfferingGroup
    //   OfferingDetailsPathResolver("Compute_Requirements", "previous")
    //   const id = DescriptionOfWork.currentGroupId
    //   expect(id).toBe(group)
    // })

    it("Test OfferingDetailsPathResolver()- should return path sanatized path", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      ClassificationRequirements.setSelectedClassificationLevels([{
        // eslint-disable-next-line camelcase
        impact_level: 'IL2',
        classification: "U",
        classification_level: {value: "v1", link: ""},
        acquisition_package: {value: "a1", link: ""}}])
      DescriptionOfWork.setCurrentOffering({name:'test',sysId:'testID'})
      const result = OfferingDetailsPathResolver("Service", "next")
      expect(result).toBe('performance-requirements/service-offering-details/compute/test')
    })

    it("Test OfferingDetailsPathResolver()- should return to dow-summary", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setCurrentOffering({name:'test',sysId:'testID'})
      DescriptionOfWork.setServiceOfferingGroups([
        {
          name: 'test1',
          label: 'Compute',
          value: 'COMPUTE',
          sequence: 1,
        },
        {
          name: 'test2',
          label: 'Applications',
          value: 'APPLICATIONS',
          sequence: 2,
        },
      ])
      DescriptionOfWork.addOfferingGroup('APPLICATIONS')
      DescriptionOfWork.addOfferingGroup('COMPUTE')
      const result = OfferingDetailsPathResolver("Service", "next")
      console.log("result", result)
      expect(result).toBe('performance-requirements/service-offering-details/compute/test')
    });

  });

  describe('Testing ServiceOfferingsPathResolver()', () => {
    it("Test ServiceOfferingsPathResolver()- should return the default path for compute", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setAddGroupFromSummary(true)
      const result = ServiceOfferingsPathResolver("test", "testing")
      expect(result).toBe('performance-requirements/service-offerings/compute')
    })
  })

  describe('Testing RequirementsPathResolver()', () => {
    it("Test RequirementsPathResolver()- should return to DOW summary", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setReturnToDOWSummary(true)
      const result = RequirementsPathResolver("Service_Offerings", "next")
      expect(result).toBe('performance-requirements/dow-summary')
    })
  })

  describe("Testing calBasePeriod()", () => {
    it("should return the amount of days in a year", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "YEAR",
              "period_unit_count": "1",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(365)
    })
    it("should return the amount of days in a week", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "WEEK",
              "period_unit_count": "1",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(7)    
    });

    it("should return the amount of days in a year", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "YEAR",
              "period_unit_count": "1",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(365)
    })

    it("should return the amount of days in a week", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "WEEK",
              "period_unit_count": "1",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(7)
    })

    it("should return the amount of days in a month", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "MONTH",
              "period_unit_count": "1",
              "period_type": "BASE",
              "option_order": "1"
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(30)
    })

    it("should return the amount of days in a month", async () => {
      jest.spyOn(Periods, 'loadPeriods').mockImplementation(
        () => Promise.resolve(
          [
            {
              "period_unit": "",
              "period_unit_count": "",
              "period_type": "",
              "option_order": ""
            },
          ]
        ));
      const result = await calcBasePeriod();
      expect(result).toBe(0)
    })
    
    // it("testing the resolver for IncrementalFunding()", () => {
    //   jest.spyOn(Periods, 'loadPeriods').mockImplementation(
    //     () => Promise.resolve(
    //       [
    //         {
    //           "period_unit": "MONTH",
    //           "period_unit_count": "1",
    //           "period_type": "BASE",
    //           "option_order": "1"
    //         },
    //       ]
    //     ));
      
    //   const result = IncrementalFundingResolver("SummaryPage");
    //   expect(result).toBe("Incremental_Funding")
    // })
  });

  it("testing the resolver for FinancialPOCResolver()", () => {
    jest.spyOn(Periods, 'loadPeriods').mockImplementation(
      () => Promise.resolve(
        [
          {
            "period_unit": "YEAR",
            "period_unit_count": "1",
            "period_type": "BASE",
            "option_order": "1"
          },
        ]
      ));

    const result = FinancialPOCResolver("SummaryPage");
    expect(result).toBe("Financial_POC_Form")
  });

  describe('IncrementalFundingResolver', () => {
    // eslint-disable-next-line max-len
    it('should return routeNames.FinancialPOCForm when current is routeNames.IncrementalFunding', async () => {
      const createStore = (storeOptions: any = {}):
          Store<{ financialDetails: any }> => new Vuex.Store({...storeOptions});
      const financialDetailsStore = getModule(FinancialDetailsStore, createStore());
      financialDetailsStore
        .setFundingRequirement({ incrementally_funded: 'YES' } as FundingRequirementDTO);

      const result = IncrementalFundingResolver(routeNames.IncrementalFunding);

      expect(result).toBe(routeNames.FinancialPOCForm);
    });

    // eslint-disable-next-line max-len
    it('should return routeNames.SummaryStepEight if fundingReq.incrementally_funded is "NO"', async () => {
      const createStore = (storeOptions: any = {}):
          Store<{ financialDetails: any }> => new Vuex.Store({...storeOptions});
      const financialDetailsStore = getModule(FinancialDetailsStore, createStore());
      financialDetailsStore
        .setFundingRequirement({ incrementally_funded: 'NO' } as FundingRequirementDTO);

      const result = IncrementalFundingResolver(routeNames.IncrementalFunding);

      expect(result).toBe(routeNames.SummaryStepEight);
    });


  });

  describe('AppropriationOfFundsResolver', () => {
    it('should return MIPR', () => {
      const mockFairOpp = {exception_to_fair_opportunity:""} as FairOpportunityDTO
      AcquisitionPackage.setFairOpportunity(mockFairOpp)
      const result = AppropriationOfFundsResolver(routeNames.IncrementalFunding);

      expect(result).toBe(routeNames.MIPR);
    });
    it('should return routeNames.SummaryStepEight when current is routeNames.MIPR', () => {
      const mockFairOpp = {exception_to_fair_opportunity: "NO_NONE"} as FairOpportunityDTO
      AcquisitionPackage.setFairOpportunity(mockFairOpp)
      const result = AppropriationOfFundsResolver(routeNames.MIPR);

      expect(result).toBe(routeNames.SummaryStepEight);
    });

  });

});
