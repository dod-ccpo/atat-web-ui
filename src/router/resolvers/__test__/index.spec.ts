import {
  ComputeOfferingDetailsPathResolver,
  OfferingDetailsPathResolver,
  RequirementsPathResolver,
  OfferGroupOfferingsPathResolver,
} from '../index'
import DescriptionOfWork from "@/store/descriptionOfWork";



describe("testing src/router/index.ts", () => {

  describe('Testing ComputeOfferingDetailsPathResolver()', () => {
    it("Test ComputeOfferingDetailsPathResolver()- should return the default path", () => {
      const result = ComputeOfferingDetailsPathResolver("test", "testing")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test ComputeOfferingDetailsPathResolver()- should return the performance path", () => {
      const result = ComputeOfferingDetailsPathResolver("DOW_Summary", "next")
      expect(result).toBe('performance-requirements')
    })

    it("Test ComputeOfferingDetailsPathResolver()- should return the summary path", () => {
      const result = ComputeOfferingDetailsPathResolver("Service_Offering_Details", "next")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test ComputeOfferingDetailsPathResolver()- should return a path for Compute", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      const result = ComputeOfferingDetailsPathResolver(
        "Service_Offering_Details", "next")
      expect(result).toBe('performance-requirements/service-offerings/compute/requirements')
    })
  })

  describe('Testing OfferingDetailsPathResolver', () => {
    it("Test OfferingDetailsPathResolver()- should return the default path", () => {
      const result = OfferingDetailsPathResolver("test", "testing")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OfferingDetailsPathResolver()- should return DOW summary path", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      const result = OfferingDetailsPathResolver("Compute_Requirements", "previous")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OfferingDetailsPathResolver()- should return DOW summary path", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      DescriptionOfWork.setReturnToDOWSummary(true)
      const result = OfferingDetailsPathResolver("Compute_Requirements", "previous")
      expect(result).toBe('performance-requirements/dow-summary')
    })

    it("Test OfferingDetailsPathResolver()- should set current group offering", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
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
      expect(group).toBe('APPLICATIONS')
    })

    it("Test OfferingDetailsPathResolver()- should return path to requirements", () => {
      DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE")
      const result = OfferingDetailsPathResolver("Service_Offerings", "next")
      expect(result).toBe('performance-requirements/service-offerings/compute/requirements')
    })
  })
})
