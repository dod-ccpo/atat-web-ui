import {ClinDTO} from "../models";
import { TableApiBase } from "../tableApiBase";

export const TABLENAME = "x_g_dis_atat_clin";

export class ClinAPI extends TableApiBase<ClinDTO> {
  constructor() {
    super(TABLENAME);
  }
}
