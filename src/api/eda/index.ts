/* eslint-disable camelcase */
import {AxiosRequestConfig} from "axios";
import {ApiBase} from "../apiBase";
import {EDAResponse} from "../models"

// export const ENDPOINTNAME = "x_g_dis_atat/eda/pds";
export const ENDPOINTNAME = "x_g_dis_atat/provisioning";


export class EDAApi extends ApiBase{
  constructor(){
    super(ENDPOINTNAME);
  }

  public async search(taskOrderNumber: string): Promise<EDAResponse> {
    const custSupportUrl = "https://community.hacc.mil/s/contact?RequestTopic=DAPPS"
    const errorMessages: Record<string, string> = {
      "0001": `Task order is already funding a portfolio. If you need assistance, 
        <a href="${custSupportUrl}" id="SupportLink" class="external-link" target="_blank">contact 
        Customer Support</a>.`,
      "0002": `Unable to locate your task order. If you need assistance, 
        <a href="${custSupportUrl}" id="SupportLink" class="external-link" target="_blank">contact 
        Customer Support</a>.`,
      "0003": `Task order not awarded under JWCC Contract.
        <a href="${custSupportUrl}" id="SupportLink" class="external-link" target="_blank">Contact 
        Customer Support</a> for assistance.`
    }    
    try {
      const requestConfig: AxiosRequestConfig = {
        params: {
          taskOrderNumber: taskOrderNumber
        }
      };      
      const response = await this.instance.get(this.endPoint,
        requestConfig
      );
      const cspInfo: Record<string, string> = {
        AWS: "Amazon Web Services (AWS)",
        GCP: "Google Cloud",
        Azure: "Microsoft Azure",
        Oracle: "Oracle Cloud"
      }
      let edaResponse: EDAResponse = {};
      if (response.status === 200) {
        const { result } = response.data;
        const csp = result.csp as string;
        edaResponse = {
          success: true,
          taskOrderNumber: result.taskOrderNumber,
          contractor: result.contractor,
          csp: result.csp as string,
          cspLong: cspInfo[csp],
          contractIssuingOffice: result.contractIssuingOffice,
          totalObligatedAmount: result.totalObligatedAmount,
          totalAmount: result.totalAmount,
          popStartDate: result.popStartDate,
          popEndDate: result.popEndDate,
          classificationLevels: result.classificationLevels,
        }
      } else {
        const { error } = response.data;
        edaResponse = {
          success: false,
          code: error.code,
          message: errorMessages[error.code] || "unknown error",
        }
      }
      return edaResponse;
    } catch (error:any) {
      return {
        success: false,
        message: errorMessages[error.response.data.result.code] || "Unknown error contacting EDA"
      };
    }
  }

  public async provisionPortfolio(
    provisioningPostObj: unknown,
    taskOrderNumber: string,
    acquisitionPackageSysId: string): Promise<EDAResponse> {
    const params: { 
      taskOrderNumber: string, 
      acquisitionPackageSysId?: string 
    } = {
      taskOrderNumber: taskOrderNumber,      
    }
    
    if (acquisitionPackageSysId) {
      params.acquisitionPackageSysId = acquisitionPackageSysId
    }

    try {
      const requestConfig: AxiosRequestConfig = { params };
      const response = await this.instance.post(this.endPoint, provisioningPostObj, requestConfig);
      let edaResponse: EDAResponse = {};
      if (response.status === 200) {
        const { result } = response.data;
        edaResponse = {
          success: true,
          taskOrderNumber: taskOrderNumber
        }
      } else {
        const { error } = response.data;
        edaResponse = {
          success: false,
          code: error.code,
          message: error.code || "unknown error",
        }
      }
      return edaResponse;
    } catch (error) {
      return {
        success: false,
        message: "Unknown error contacting EDA"
      };
    }
  }
}
