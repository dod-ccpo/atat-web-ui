import {FundingIncrementDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_funding_increment";
export class FundingIncrementApi extends TableApiBase<FundingIncrementDTO> {
  constructor() {
    super(TABLENAME);
  }

}
