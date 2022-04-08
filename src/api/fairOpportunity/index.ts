import {FairOpportunityDTO} from "@/models/FairOpportunityDTO";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_fair_opportunity";
export class FairOpportunityApi extends TableApiBase<FairOpportunityDTO> {
  constructor() {
    super(TABLENAME);
  }

}
