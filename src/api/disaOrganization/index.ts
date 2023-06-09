import { TableApiBase } from "../tableApiBase";
import { DisaOrganizationDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_disa_organization";

export class DisaOrganizationApi extends TableApiBase<DisaOrganizationDTO> {
  constructor() {
    super(TABLENAME);
  }

}
