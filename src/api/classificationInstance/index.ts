import { ClassificationInstanceDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_classification_instance";
export class ClassificationInstanceApi extends TableApiBase<ClassificationInstanceDTO> {
  constructor() {
    super(TABLENAME);
  }
}