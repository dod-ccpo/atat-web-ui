import { GFEOverviewDTO } from "@/api/models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_gfe_overview";

export class GFEOverviewApi extends TableApiBase<GFEOverviewDTO> {
  constructor() {
    super(TABLENAME);
  }

}
