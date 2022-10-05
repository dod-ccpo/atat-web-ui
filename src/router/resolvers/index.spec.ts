import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import { 
  IGCECannotProceedResolver, 
  IGCEGatherPriceEstimatesResolver, 
  IGCESupportingDocumentationResolver 
} from "../resolvers/index"


describe("testing route resolvers", () => {
  const legitPeriod = [
    {
      "period_unit": "YEAR",
      "period_unit_count": "1",
      "period_type": "BASE",
      "option_order": "1"
    }
  ]
  afterEach(()=>{
    //reset periodOfPerformance and DOW back to incomplete
    Periods.setPeriods([]);
    DescriptionOfWork.setIsIncomplete(true);
  })
  describe("IGCE Resolvers", ()=>{
    it("IGCECannotProceedResolver('Create_Price_Estimate') returns routeNames.CannotProceed", 
      async () => {
        const newRoute = await IGCECannotProceedResolver("Create_Price_Estimate");
        expect(newRoute).toBe("Cannot_Proceed");
      });

    it("IGCECannotProceedResolver('Create_Price_Estimate') with expected criteria to return " +
        "routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      const newRoute = await IGCECannotProceedResolver("Create_Price_Estimate");
      expect(newRoute).toBe("Gather_Price_Estimates");
    });

    it("IGCECannotProceedResolver('Gather_Price_Estimates') with expected criteria to return " +
        "routeNames.CreatePriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      const newRoute = await IGCECannotProceedResolver("Gather_Price_Estimates");
      expect(newRoute).toBe("Create_Price_Estimate");
    });

    it("IGCEGatherPriceEstimatesResolver('Gather_Price_Estimates') returns " +
        "routeNames.CannotProceed", 
    async () => {
      const newRoute = await IGCEGatherPriceEstimatesResolver("Create_Price_Estimate");
      expect(newRoute).toBe("Funding_Plan_Type");
    });

    it("IGCECannotProceedResolver('Gather_Price_Estimates') with expected criteria to return " +
        "routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      const newRoute = await IGCEGatherPriceEstimatesResolver("Gather_Price_Estimates");
      expect(newRoute).toBe("Create_Price_Estimate");
    });

    it("IGCESupportingDocumentationResolver('Funding_Plan_Type') " +
        "returns routeNames.CannotProceed", 
    async () => {
      const newRoute = await IGCESupportingDocumentationResolver("Funding_Plan_Type");
      expect(newRoute).toBe("Cannot_Proceed");
    });

    it("IGCESupportingDocumentationResolver('Funding_Plan_Type') with expected " +
        "criteria to return routeNames.GatherPriceEstimates", async () => {
      Periods.setPeriods(legitPeriod)
      DescriptionOfWork.setIsIncomplete(false);
      const newRoute = await IGCESupportingDocumentationResolver("Funding_Plan_Type");
      expect(newRoute).toBe("Estimates_Developed");
    });
  })

})
