import { TableApiBase } from "../tableApiBase";
import { TravelRequirementDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_travel_requirement";

export class travelRequirementApi extends TableApiBase<TravelRequirementDTO> {
  constructor() {
    super(TABLENAME);
  }

}
