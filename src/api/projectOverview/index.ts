import { TableApiBase } from "../tableApiBase";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";

const TABLENAME = "x_g_dis_atat_project_overview";
export class ProjectOverviewApi extends TableApiBase<ProjectOverviewDTO> {
  constructor() {
    super(TABLENAME);
  }
}
