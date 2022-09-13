import api from "@/api";
import { BaseTableDTO } from "@/api/models";
import { TableApiBase } from "@/api/tableApiBase";
import { StoreProperties } from "./storeproperties";

export const getApiService = (serviceKey: string): TableApiBase<BaseTableDTO> => {
    
  switch(serviceKey){
  case  StoreProperties.ContractType: 
    return api.contractTypeTable;
  case StoreProperties.CurrentContract: 
    return api.currentContractTable;
  case StoreProperties.FairOpportunity: 
    return api.fairOpportunityTable;
  case StoreProperties.GFEOverview: 
    return api.gfeOverviewTable;
  case StoreProperties.Organization: 
    return api.organizationTable;
  case StoreProperties.Periods: 
    return api.periodTable;
  case StoreProperties.ProjectOverview: return api.projectOverviewTable;
  case StoreProperties.PeriodOfPerformance: return  api.periodOfPerformanceTable;
  case StoreProperties.RequirementsCostEstimate: return  api.requirementsCostEstimateTable;
  case StoreProperties.SensitiveInformation: return api.sensitiveInformationTable;
  case StoreProperties.CurrentEnvironment : return api.currentEnvironmentTable;
  case StoreProperties.ClassificationLevel: return api.classificationLevelTable;

  default:
    throw new Error(`unable to locate service for key ${serviceKey}`);
  }

}