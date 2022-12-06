import { ClassificationLevelDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_selected_classification_levels";
export class SelectedClassificationLevels extends TableApiBase<ClassificationLevelDTO> {
  constructor() {
    super(TABLENAME);
  }
}
