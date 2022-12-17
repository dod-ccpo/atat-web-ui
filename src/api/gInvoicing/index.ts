/* eslint-disable camelcase */
import { AxiosRequestConfig } from "axios";
import { ApiBase } from "../apiBase";
import { GInvoicingResponse } from "../models"

export const ENDPOINTNAME = "x_g_dis_atat/g_invoicing/order_validation";


export class GInvoicingApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }

  public async search(orderNumber: string): Promise<GInvoicingResponse> {
    try {

      const requestConfig: AxiosRequestConfig = {
        params: {
          orderNumber: orderNumber
        }
      };

      const apiResponse = await this.instance.get(this.endPoint,
        requestConfig
      );

      if(apiResponse.status === 200){
        const { result } = apiResponse.data;

        const response: GInvoicingResponse = {
          valid: result.valid,
          message: result.message
        };

        return response;
      } else {
        const { error } = apiResponse.data;

        const response: GInvoicingResponse = {
          valid: error.valid,
          message: error.message
        };

        return response;
      }

    } catch (error) {
      const response: GInvoicingResponse = {
        valid: false,
        message: "unknown error"
      }

      return response;
    }
  }

}