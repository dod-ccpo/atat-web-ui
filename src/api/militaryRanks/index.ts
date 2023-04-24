import { MilitaryRankDTO } from "@/api/models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_military_rank";

export class MilitaryRankApi extends TableApiBase<MilitaryRankDTO> {
  constructor() {
    super(TABLENAME);
  }

}
