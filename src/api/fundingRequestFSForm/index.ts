import {FundingRequestFSFormDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_funding_request_fs_form";
export class FundingRequestFSFormApi extends TableApiBase<FundingRequestFSFormDTO> {
  constructor() {
    super(TABLENAME);
  }
}
