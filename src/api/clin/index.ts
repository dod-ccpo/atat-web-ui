import {ClinDisplayDTO, ClinDTO} from "../models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_clin";

export class ClinAPi extends TableApiBase<ClinDTO> {
  constructor() {
    super(TABLENAME);
  }

}

export class ClinDisplayAPi extends TableApiBase<ClinDisplayDTO> {
  constructor() {
    super(TABLENAME);
  }
}
