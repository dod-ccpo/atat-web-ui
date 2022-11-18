import {FundingRequirementDTO} from "../models";
import {TableApiBase} from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_funding_requirement";

export class FundingRequirementApi extends TableApiBase<FundingRequirementDTO> {
  constructor() {
    super(TABLENAME);
  }
}
