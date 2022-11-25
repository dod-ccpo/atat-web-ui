import {FairOpportunityDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_fair_opportunity";
export class FairOpportunityApi extends TableApiBase<FairOpportunityDTO> {
  constructor() {
    super(TABLENAME);
  }

}
