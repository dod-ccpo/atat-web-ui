import { TableApiBase } from "../tableApiBase";
import { OrganizationDTO } from "@/models/OrganizationDTO";

const TABLENAME = "x_g_dis_atat_organization";

export class OrganizationApi extends TableApiBase<OrganizationDTO> {
  constructor() {
    super(TABLENAME);
  }

}
