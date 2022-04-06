import { BackgroundDTO } from "@/models/BackgroundDTO";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_current_contract_and_recurring_information";
export class BackgroundApi extends TableApiBase<BackgroundDTO> {
  constructor() {
    super(TABLENAME);
  }
}