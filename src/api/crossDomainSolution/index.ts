import { CrossDomainSolutionDTO } from "../models";
import { TableApiBase } from "../tableApiBase";
export const TABLENAME = "x_g_dis_atat_cross_domain_solution";
export class CrossDomainSolutionAPI extends TableApiBase<CrossDomainSolutionDTO> {
  constructor() {
    super(TABLENAME);
  }
}