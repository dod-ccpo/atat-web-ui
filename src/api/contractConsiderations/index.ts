import { ContractConsiderationsDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_contract_considerations";

export class ContractConsiderationsApi extends TableApiBase<ContractConsiderationsDTO> {
  constructor() {
    super(TABLENAME);
  }
}
