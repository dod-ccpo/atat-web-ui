import { FairOpportunityDTO } from "../models";
import { MarketResearchTechniquesDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_fair_opportunity";
export class FairOpportunityApi extends TableApiBase<FairOpportunityDTO> {
  constructor() {
    super(TABLENAME);
  }
}

export class MarketResearchTechniquesApi extends TableApiBase<MarketResearchTechniquesDTO> {
  constructor() {
    super("x_g_dis_atat_dapps_market_research_other_techniques");
  }
}