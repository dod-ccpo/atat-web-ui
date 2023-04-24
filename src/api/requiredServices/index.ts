import { TableApiBase } from "../tableApiBase";
import { RequiredServicesDTO }  from "@/api/models";

export const TABLENAME = "x_g_dis_atat_required_services";

export class RequiredServicesApi extends TableApiBase<RequiredServicesDTO> {
  constructor() {
    super(TABLENAME);
  }

}
