/* eslint-disable camelcase */
import { AxiosRequestConfig } from "axios";
import { ApiBase } from "../apiBase";

export const ENDPOINTNAME = "now/stats";


export class AggregateApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }



  public async makeRequest(path: string, config?: AxiosRequestConfig): Promise<unknown>{
    try {
      const response = await this.get(path, config);
      if(response.status !== 200){
        throw new Error(`${response.statusText}`);
      }
      return response.data;
        
    } catch (error) {
      throw new Error(`${error}`);
    }
  }


}