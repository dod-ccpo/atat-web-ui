import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseApi from "./base";


export  class TableApiBase extends baseApi  {

      private endPoint: string;
      
      constructor(tableName: string){  
          super();
        this.endPoint = `/now/table/${tableName}`;
      }

      private urlWithSysId(sys_id: string): string {
            return `${this.endPoint}/${sys_id}`;
      }

     async post<TData>(data?: TData, config?:AxiosRequestConfig):Promise<AxiosResponse>{
           return this.instance.post(this.endPoint, data, config);
     }

     async get(sys_id: string, config?:AxiosRequestConfig):Promise<AxiosResponse>{
          return this.instance.get(this.urlWithSysId(sys_id), config);
     }

     async put<TData>(sys_id: string, data?: TData, config?:AxiosRequestConfig):Promise<AxiosResponse>{
          return this.instance.put(this.urlWithSysId(sys_id),this.endPoint, config);
     }

     async delete(sys_id:string, config?:AxiosRequestConfig): Promise<AxiosResponse>{
         return this.instance.delete(this.urlWithSysId(sys_id),config);
     }

     async patch<TData>(sys_id: string, data?:TData, config?:AxiosRequestConfig):Promise<AxiosResponse>{
          return this.instance.patch(this.urlWithSysId(sys_id), data, config);
     }
  }