import { ClassificationLevelDTO } from "@/api/models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_classification_level";
export class ClassificationLevelApi extends TableApiBase<ClassificationLevelDTO> {
  constructor() {
    super(TABLENAME);
  }
}