import { PeriodOfPerformanceDTO } from "../models";
import { ContractTypeDTO } from "../models";
import { TableApiBase } from "../tableApiBase";

const PoPTABLENAME = "x_g_dis_atat_period_of_performance";
const ContractTypeTABLENAME = "x_g_dis_atat_contract_type";

export class PeriodOfPerformanceApi extends TableApiBase<PeriodOfPerformanceDTO> {
  constructor() {
    super(PoPTABLENAME);
  }
}

export class ContractTypeApi extends TableApiBase<ContractTypeDTO> {
  constructor() {
    super(ContractTypeTABLENAME);
  }
}
