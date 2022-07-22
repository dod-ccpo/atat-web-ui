/* eslint-disable camelcase */
import { ApiBase } from "../apiBase";
import { EDAResponse } from "../models"

export const ENDPOINTNAME = "x_g_dis_atat/eda/pds";


export class EDAApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }


 
  public async search(taskOrderNumber: string): Promise<EDAResponse> {
    
    try {
      const response = await this.post({
        delivery_order_number : taskOrderNumber
      });
      if (response.status === 200) {
        const { result } = response.data;
        const edaResponse: EDAResponse = {
          success: true,
          message: result.success
        }
        return edaResponse;
      } else {
        const { error } = response.data;
        const edaResponse: EDAResponse = {
          success: false,
          message: error.message || "unknown error"
        }

        return edaResponse;
      }
    } catch (error) {
      const edaResponse: EDAResponse = {
        success: false,
        message: "unknown error"
      }

      return edaResponse;
    }
  }

}