import { FundingRequestDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_funding_request";
export class FundingRequestApi extends TableApiBase<FundingRequestDTO> {
  constructor() {
    super(TABLENAME);
  }
}
