/* eslint-disable camelcase */
import { ApiBase } from "../apiBase";
import { CostEstimateDTO } from "../models"
import { AxiosRequestConfig } from "axios";

export const ENDPOINTNAME = "x_g_dis_atat/cost_estimate/data";


export class CostEstimateApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }

  public async search(packageId: string): Promise<CostEstimateDTO> {
    try {
      const requestConfig: AxiosRequestConfig = {
        params: {
          packageId: packageId
        }
      };
      const response = await this.instance.get(this.endPoint,
        requestConfig
      );
      if (response.status === 200) {
        const { result } = response.data;
        const CostEstimateDTO: CostEstimateDTO = {
          packageId: result.packageId,
          payload: result.payload
        }
        return CostEstimateDTO;
      } else {
        const { error } = response.data;
        return error;
      }
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

}
