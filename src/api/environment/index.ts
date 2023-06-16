import {TableApiBase} from "@/api/tableApiBase";
import {EnvironmentDTO} from "@/api/models";

const TABLENAME = "x_g_dis_atat_environment";

export class EnvironmentApi extends TableApiBase<EnvironmentDTO> {
  constructor() {
    super(TABLENAME);
  }
}
