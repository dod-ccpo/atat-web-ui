import {TableApiBase} from "@/api/tableApiBase";
import {OperatorDTO} from "@/api/models";

export const TABLENAME = "x_g_dis_atat_operator";

export class OperatorAPI extends TableApiBase<OperatorDTO> {
  constructor() {
    super(TABLENAME);
  }
}
