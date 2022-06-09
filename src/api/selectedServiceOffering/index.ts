import {SelectedServiceOfferingDTO} from "../models";
import { TableApiBase } from "../tableApiBase";
const TABLENAME = "x_g_dis_atat_selected_service_offering";
export class SelectedServiceOfferingApi extends TableApiBase<SelectedServiceOfferingDTO> {
  constructor() {
    super(TABLENAME);
  }

}
