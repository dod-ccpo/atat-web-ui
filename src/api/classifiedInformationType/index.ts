import { ClassifiedInformationTypeDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_classified_information_type";
export class ClassifiedInformationTypeAPI 
  extends TableApiBase<ClassifiedInformationTypeDTO> {
  constructor() {
    super(TABLENAME);
  }
}