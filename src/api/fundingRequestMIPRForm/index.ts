import { FundingRequestMIPRFormDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_funding_request_mipr";
export class FundingRequestMIPRFormApi extends TableApiBase<FundingRequestMIPRFormDTO> {
  constructor() {
    super(TABLENAME);
  }

}
