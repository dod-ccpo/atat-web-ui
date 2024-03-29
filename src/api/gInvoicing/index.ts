/* eslint-disable camelcase */
import { AxiosRequestConfig } from "axios";
import { ApiBase } from "../apiBase";
import { GInvoicingResponse } from "../models"

export const ENDPOINTNAME = "x_g_dis_atat/g_invoicing/";


export class GInvoicingApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }

  public async searchGtc(gtcNumber: string, acqPackageId: string): Promise<GInvoicingResponse> {
    let response: GInvoicingResponse = {
      valid: true,
      message:""
    };
    try {
      const requestConfig: AxiosRequestConfig = {
        params: {
          gtcNumber: gtcNumber,
          acquisitionPackageId: acqPackageId
        }
      };
      const apiResponse = await this.instance.get(`${this.endPoint}/gtc_validation`,
        requestConfig
      );
      if(apiResponse.status === 200){
        response = {
          valid: true,
          message: apiResponse?.data?.result
        };
        return response;
      } 
    } catch (error) {
      response = {
        valid: false,
        message: "unknown error"
      }
    }
    return response;
  }

  public async searchOrder(orderNumber: string, acqPackageId: string): Promise<GInvoicingResponse> {
    let response: GInvoicingResponse = {
      valid: true,
      message:""
    };
    try {
      const requestConfig: AxiosRequestConfig = {
        params: {
          orderNumber: orderNumber,
          acquisitionPackageId: acqPackageId
        }
      };
      const apiResponse = await this.instance.get(`${this.endPoint}/order_validation`,
        requestConfig
      );
      
      if(apiResponse.status === 200){
        response = {
          valid: true,
          message: apiResponse?.data?.result
        };
        return response;
      }

    } catch (error) {
      response = {
        valid: false,
        message: "unknown error"
      }
    }
    return response;
  }

}