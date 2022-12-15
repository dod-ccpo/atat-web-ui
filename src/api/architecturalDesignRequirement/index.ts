import { ArchitecturalDesignRequirementDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_architectural_design_requirement";
export class ArchitecturalDesignRequirementAPI 
  extends TableApiBase<ArchitecturalDesignRequirementDTO> {
  constructor() {
    super(TABLENAME);
  }
}