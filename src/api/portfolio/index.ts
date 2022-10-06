import {TableApiBase} from "@/api/tableApiBase";
import {PortfolioSummaryDTO} from "@/api/models";

const TABLENAME = "x_g_dis_atat_portfolio";

export class PortfolioApi extends TableApiBase<PortfolioSummaryDTO> {
  constructor() {
    super(TABLENAME);
  }
}
