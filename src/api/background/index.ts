import { CurrentContractExistsDTO, CurrentContractDetailsDTO } from "@/models/BackgroundDTOs";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_current_contract_and_recurring_information";
export class CurrentContractExistsApi extends TableApiBase<CurrentContractExistsDTO> {
  constructor() {
    super(TABLENAME);
  }
}

export class CurrentContractDetailsApi extends TableApiBase<CurrentContractDetailsDTO> {
  constructor() {
    super(TABLENAME);
  }
}
