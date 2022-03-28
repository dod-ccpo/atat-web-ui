import { TableApiBase } from "../tableApiBase";
import { ProjectOverviewDTO } from "@/models/ProjectOverviewDTO";

const TABLENAME = "x_g_dis_atat_project_overview";

export class ProjectOverviewApi extends TableApiBase {
  constructor() {
    super(TABLENAME);
  }

  async create(data: ProjectOverviewDTO): Promise<ProjectOverviewDTO> {
    try {
      const response = await this.post<ProjectOverviewDTO>(data);
      if (response.status === 201) {
        const { result } = response.data;
        return result as ProjectOverviewDTO;
      } else {
        throw new Error("unable to create Project Overview");
      }
    } catch (error) {
      throw new Error(`unable to create Project Overview ${error}`);
    }
  }

  async update(data: ProjectOverviewDTO): Promise<ProjectOverviewDTO> {
    try {
      const response = await this.patch(data.sys_id || "", data);
      if (response.status === 200) {
        const { result } = response.data;
        return result as ProjectOverviewDTO;
      } else {
        throw new Error("unable to create Project Overview");
      }
    } catch (error) {
      throw new Error(`unable to create Project Overview ${error}`);
    }
  }

  async getData(sys_id: string): Promise<ProjectOverviewDTO> {
      try{
        const response = await this.get(sys_id);
        if (response.status === 200) {
          const { result } = response.data;
          return result as ProjectOverviewDTO;
        } else {
          throw new Error(`unable to retrieve Project Overview with sys_id: ${sys_id}`);
        }
      } catch (error) {
        throw new Error(`unable to create Project Overview ${error}`);
      }
  }

}
