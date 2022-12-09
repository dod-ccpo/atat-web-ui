import {SelectedClassificationLevelDTO} from "../models";
import {TableApiBase} from "../tableApiBase";

const TABLENAME = "x_g_dis_atat_selected_classification_level";

export class SelectedClassificationLevelApi extends TableApiBase<SelectedClassificationLevelDTO> {
  constructor() {
    super(TABLENAME);
  }
}
