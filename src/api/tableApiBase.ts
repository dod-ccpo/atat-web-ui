import { AxiosRequestConfig, AxiosResponse } from "axios";
import baseApi from "./base";

export  class TableApiBase extends baseApi  {

      private endPoint: string;
      
      constructor(tableName: string){  
          super();
        this.endPoint = `/now/table/${tableName}`;
      }

     async post<TData>(data?: TData, config?:AxiosRequestConfig):Promise<AxiosResponse>{
           return this.instance.post(this.endPoint, data, config);
     }

     async get(config?:AxiosRequestConfig):Promise<AxiosResponse>{
          return this.instance.get(this.endPoint, config);
     }

     async put<TData>(data?: TData, config?:AxiosRequestConfig):Promise<AxiosResponse>{
          return this.instance.put(this.endPoint, config);
     }

     async delete(config?:AxiosRequestConfig): Promise<AxiosResponse>{
         return this.delete(config);
     }
  }