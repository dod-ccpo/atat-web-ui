import { AlertDTO } from "@/api/models";
import api  from "@/api";
import { AxiosRequestConfig } from "axios";

export default class AlertService {

  async getAlerts(taskOrderNumber: string): Promise<AlertDTO[]>{
    let fields =  'active,alert_type,clin,last_notification_date';
    fields+='portfolio,task_order,threshold_violation_amount';

    let query = `task_order.task_order_number=${taskOrderNumber}`;
    query+=`^active=true^ORBERBYDESCsys_updated_on`;
        
    try {
      const alertsRequestConfig: AxiosRequestConfig = {
        params: {
          // eslint-disable-next-line camelcase
          sysparm_fields: fields,
          // eslint-disable-next-line camelcase
          sysparm_query: query,
        },
      };
      const alerts = await api.alertsTable.getQuery(alertsRequestConfig);
      return alerts;
    
    }
    catch(error){
      throw new Error(`error retrieving alert data ${error}`);
    }
  }
}