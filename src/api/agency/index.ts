import { TableApiBase } from "../tableApiBase";
import { AgencyDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_agency";

export class AgencyApi extends TableApiBase<AgencyDTO> {
  constructor() {
    super(TABLENAME);
  }

}
