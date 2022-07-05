import { TableApiBase } from "../tableApiBase";
import { TaskOrderDTO } from "@/api/models";

export const TABLENAME = "x_g_dis_atat_task_order";

export class TaskOrderApi extends TableApiBase<TaskOrderDTO> {
  constructor() {
    super(TABLENAME);
  }

}
