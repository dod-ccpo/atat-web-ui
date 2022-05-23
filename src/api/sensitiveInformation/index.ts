import { SensitiveInformationDTO } from "@/api/models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_sensitive_information";
export class SensitiveInformationApi extends TableApiBase<SensitiveInformationDTO> {
  constructor() {
    super(TABLENAME);
  }
}


