import { ClassificationLevelDTO, SelectedClassificationLevelDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_classification_level";
export class ClassificationLevelApi extends TableApiBase<SelectedClassificationLevelDTO> {
  constructor() {
    super(TABLENAME);
  }
}
