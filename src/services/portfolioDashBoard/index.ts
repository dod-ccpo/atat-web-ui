import api from "@/api";
import { ClinDTO, CostsDTO, TaskOrderDTO } from "@/api/models";
import { AxiosRequestConfig } from "axios";

export interface PortFolioDashBoardDTO {
     taskOrder: TaskOrderDTO;
     clins: ClinDTO[];
     costs: CostsDTO[];
}


export class PortfolioDashBoardService{


  public async getdata(taskOrderNumber: string): Promise<PortFolioDashBoardDTO>{

    try {
      const taskOrderRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          sysparm_query: `task_order_number=${taskOrderNumber}`,
        }
      }
      
      const taskOrders = await api.taskOrderTable.all(taskOrderRequestConfig);
      const taskOrder = taskOrders.length > 0 ? taskOrders[0] : undefined;
    
      
      if(taskOrder === undefined){
        throw new Error(`unable to retrieve task order with number ${taskOrderNumber}`);
      }

      //grab all of the task order clins
      const clinIds = taskOrder.clins.split(',');
      const clinRequests = clinIds.map(clin=> api.clinTable.retrieve(clin));
      const clins = await Promise.all(clinRequests);
      
      const popStartDate = taskOrder.pop_start_date;
      const popEndDate = taskOrder.pop_end_date;
      
      let costsQuery = `task_order_number=${taskOrderNumber}`;
      costsQuery+= `^year_monthBETWEENjavascript:gs.dateGenerate('${popStartDate}','start')`;
      costsQuery+= `@javascript:gs.dateGenerate('${popEndDate}','end')`;
      
      const costsRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          sysparm_query: costsQuery
        }
      }
      
      const costs = await api.costsTable.all(costsRequestConfig);
      
      return {
      
        taskOrder,
        clins,
        costs,
      }
    } catch (error) {
      throw new Error(`error retrieving dashboard data ${error}`);
    } 
  }
}