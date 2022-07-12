import api from "@/api";
import { ClinDTO, CostsDTO, TaskOrderDTO } from "@/api/models";
import { TABLENAME as ClinTable } from "@/api/clin";
import { AxiosRequestConfig } from "axios";

export class JWCCDashboardService {

  public async getFundSpentToDate(taskOrderNumber: string): Promise<unknown>{

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
      let clins = await Promise.all(clinRequests);

      // eslint-disable-next-line camelcase
      const clin_labels = await api.systemChoices.getChoices(ClinTable, "idiq_clin");

      clins = clins.map(clin=> {

        // eslint-disable-next-line camelcase
        const label = clin_labels.find(label=>label.value === clin.idiq_clin);
        if(label){

          // eslint-disable-next-line camelcase
          clin.idiq_clin_label = label.label
        }
         
        return clin;
      });
      
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
        activeTaskOrders: 1,
        averageMonthlySpend: 0,
        totalObligatedFunds: 0,
        totalTaskOrderValue: 0,
        taskOrder,
        clins,
        costs,
      }
    } catch (error) {
      throw new Error(`error retrieving dashboard data ${error}`);
    } 
  }
}