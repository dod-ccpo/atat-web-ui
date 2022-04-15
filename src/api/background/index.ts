import { CurrentContractDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_current_contract_and_recurring_information";
export class CurrentContractApi extends TableApiBase<CurrentContractDTO> {
  constructor() {
    super(TABLENAME);
  }
}
