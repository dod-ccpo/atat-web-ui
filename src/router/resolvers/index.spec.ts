import DescriptionOfWork from "@/store/descriptionOfWork";
import Periods from "@/store/periods";
import { IGCEResolver } from "../resolvers/index"

describe("testing route resolvers", () => {

  it("IGCE('CurrentPriceEstimate') returns routeNames.CannotProceed", async () => {
    const newRoute = await IGCEResolver("Create_Price_Estimate");
    expect(newRoute).toBe("Cannot_Proceed");
  });

  it("IGCE('CurrentPriceEstimate') with expected criteria to return " +
  "routeNames.GatherPriceEstimates", async () => {
    Periods.setPeriods([
      {
        "period_unit": "YEAR",
        "period_unit_count": "1",
        "period_type": "BASE",
        "option_order": "1"
      }
    ])
    DescriptionOfWork.setIsIncomplete(false);
    const newRoute = await IGCEResolver("Create_Price_Estimate");
    expect(newRoute).toBe("Gather_Price_Estimates");
  });
})
