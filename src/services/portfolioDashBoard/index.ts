import api from "@/api";
import { CostsDTO, TaskOrderDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";

export interface PortFolioDashBoardDTO {
     taskOrder: TaskOrderDTO;
     costs: CostsDTO[];
}


export class PortFolioDashBoardService{


  public async getdata(taskOrderNumber: string): Promise<PortFolioDashBoardDTO>{

    try {
      const taskOrderRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          sysparm_query: `task_order_number=${taskOrderNumber}`,
        }
      }
      
      const taskOrder = await api.taskOrderTable.retrieve("", taskOrderRequestConfig);
      
      if(taskOrder === undefined){
        throw new Error(`unable to retrieve task order with number ${taskOrderNumber}`);
      }
      
      const popStartDate = taskOrder.pop_start_date;
      const popEndDate = taskOrder.pop_end_date;
      
      let costsQuery = `task_order_number=${taskOrderNumber}`;
      costsQuery+= `^BETWEENjavascript:gs.dateGenerate(${popStartDate},'start')`;
      costsQuery+= `@javascript:gs.dateGenerate(${popEndDate},'end')`;
      
      const costsRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          sysparm_query: costsQuery
        }
      }
      
      const costs = await api.costsTable.all(costsRequestConfig);
      
      return {
      
        taskOrder,
        costs,
      }
    } catch (error) {
      throw new Error(`error retrieving dashboard data ${error}`);
    } 
  }
}