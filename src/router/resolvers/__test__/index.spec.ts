import {
  OtherOfferingSummaryPathResolver,
  OfferingDetailsPathResolver,
  RequirementsPathResolver,
  OfferGroupOfferingsPathResolver,
  // calcBasePeriod, 
  IncrementalFundingResolver, 
  FinancialPOCResolver  
} from '../index'
import DescriptionOfWork from "@/store/descriptionOfWork";
import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";

const routeNames = {
  SummaryPage: "SummaryPage"
}

describe("testing src/router/index.ts", () => {

  describe("Testing calBasePeriod()", async () => {
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

    it("Test OfferingDetailsPathResolver()- should change current group offering", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setReturnToDOWSummary(false)
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
      const group = DescriptionOfWork.prevOfferingGroup
      OfferingDetailsPathResolver("Compute_Requirements", "previous")
      const id = DescriptionOfWork.currentGroupId
      expect(id).toBe(group)
    })

    it("Test OfferingDetailsPathResolver()- should return path sanatized path", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      ClassificationRequirements.setSelectedClassificationLevels([{
        // eslint-disable-next-line camelcase
        impact_level: 'IL2',
        classification: "U"}])
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
      expect(result).toBe("performance-requirements/service-offerings/applications");
      // EJY should never result in below
      // expect(result).toBe('performance-requirements/service-offering-details/compute/test')
    })
  })

  describe('Testing OfferGroupOfferingsPathResolver()', () => {
    it("Test OfferGroupOfferingsPathResolver()- should return the default path for compute", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setAddGroupFromSummary(true)
      const result = OfferGroupOfferingsPathResolver("test", "testing")
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
})
