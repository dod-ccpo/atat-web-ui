import { TrainingEstimateDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_training_estimate";
export class TrainingEstimateAPI extends TableApiBase<TrainingEstimateDTO> {
  constructor() {
    super(TABLENAME);
  }
}