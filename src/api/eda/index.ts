/* eslint-disable camelcase */
import { ApiBase } from "../apiBase";
import { EDAResponse } from "../models"

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
      const response = await this.post({
        delivery_order_number : taskOrderNumber
      });
      let edaResponse: EDAResponse = {};
      if (response.status === 200) {
        const { result } = response.data;
        edaResponse = {
          success: true,
          taskOrderNumber: result.taskOrderNumber,
          contractor: result.contractor,
          csp: result.csp,
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
    } catch (error) {
      // TODO: reinstate after API call wired up from backend
      // const edaResponse: EDAResponse = {
      //   success: false,
      //   message: "Unknown error contacting EDA"
      // }
      // return edaResponse;

      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      // CODE BELOW for testing only - remove when EDA API call wired up
      // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
      let tempEdaResponse: EDAResponse = {};
      if (taskOrderNumber.includes("400000000000")) {
        tempEdaResponse = {
          success: true,
          taskOrderNumber: taskOrderNumber,
          contractor: "Microsoft Corporation",
          csp: "Azure",
          contractIssuingOffice: "DITCO",
          totalObligatedAmount: 10000000,
          totalAmount: 50000000,
          popStartDate: "2021-07-01",
          popEndDate: "2026-07-01",
          classificationLevels: ["Unclassified", "Secret"]          
        }
        if (taskOrderNumber === "4000000000001") {
          tempEdaResponse.classificationLevels = ["Unclassified"];
          tempEdaResponse.csp = "GCP"
          tempEdaResponse.contractor = "Google Support Services LLC"
        }     
        if (taskOrderNumber === "4000000000002") {
          tempEdaResponse.classificationLevels = ["Secret"];
          tempEdaResponse.csp = "AWS"
          tempEdaResponse.contractor = "Amazon Web Services Inc."
        }     
        if (taskOrderNumber === "4000000000003") {
          tempEdaResponse.classificationLevels = ["Secret"];
          tempEdaResponse.csp = "Oracle"
          tempEdaResponse.contractor = "Oracle America Inc."
        }     
      } else {
        let tempErrorCode = "";
        switch (taskOrderNumber) {
        case "1000000000000":
          tempErrorCode = "0001";
          break;
        case "2000000000000":
          tempErrorCode = "0002";
          break;
        case "3000000000000": 
          tempErrorCode = "0003";
          break;
        }
        if (tempErrorCode) {
          tempEdaResponse = {
            code: tempErrorCode,
            success: false,
            message: errorMessages[tempErrorCode] || "unknown error",
          }
        } else {
          tempEdaResponse = {
            success: false,
            message: "Task order search not yet implemented."
          }
        } 
      }  

      return tempEdaResponse;

    }
  }

}