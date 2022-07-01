import { AcquisitionPackagesApi } from "./acquisitionPackages";
import { ProjectOverviewApi } from "./projectOverview";
import { OrganizationApi } from "./organization";
import { ContactsApi } from "./contacts";
import { FairOpportunityApi } from "./fairOpportunity";
import { CurrentContractApi } from "./background";
import { ContractConsiderationsApi } from "./contractConsiderations";
import { SensitiveInformationApi } from "./sensitiveInformation";
import { MilitaryRankApi } from "./militaryRanks";
import { SystemChoicesApi } from "./systemChoices";
import { ContractTypeApi, PeriodOfPerformanceApi } from "./contractDetails";
import { GFEOverviewApi } from "./GFEOverview";
import { RequirementsCostEstimateApi } from "./requriementsCostEstimate";
import {StatesApi} from "./states";
import {CountriesApi} from "./countries";
import { FundingPlanApi } from "./fundingPlan";
import { AttachmentApi } from "./attachments";
import { TableApiBase } from "./tableApiBase";
import { AttachableDTO } from "./models";
import { PeriodApi } from "./period";
import { ClassificationLevelApi } from "./classificationLevels";
import { ServiceOfferingApi } from "./serviceOffering";
import { SelectedServiceOfferingApi } from "./selectedServiceOffering";
import { ClassificationInstanceApi } from "./classificationInstance";
import { TaskOrderApi } from "./taskOrder";

export const api = {

  attachments: new AttachmentApi(),
  systemChoices: new SystemChoicesApi(),
  acquisitionPackageTable: new AcquisitionPackagesApi(),
  projectOverviewTable: new ProjectOverviewApi(),
  organizationTable: new OrganizationApi(),
  classificationInstanceTable: new ClassificationInstanceApi(),
  classificationLevelTable: new ClassificationLevelApi(),
  contactsTable: new ContactsApi(),
  contractConsiderationsTable: new ContractConsiderationsApi(),
  fairOpportunityTable: new FairOpportunityApi(),
  fundingPlanTable :new FundingPlanApi(),
  currentContractTable: new CurrentContractApi(),
  sensitiveInformationTable: new SensitiveInformationApi(),
  serviceOfferingTable: new ServiceOfferingApi(),
  militaryRankTable: new MilitaryRankApi(),
  periodTable: new PeriodApi(),
  periodOfPerformanceTable: new PeriodOfPerformanceApi(),
  gfeOverviewTable: new GFEOverviewApi(),
  contractTypeTable: new ContractTypeApi(),
  requirementsCostEstimateTable: new RequirementsCostEstimateApi(),
  selectedServiceOfferingTable: new SelectedServiceOfferingApi(),
  statesTable: new StatesApi(),
  countriesTable: new CountriesApi(),
  taskOrderTable: new TaskOrderApi(),
}

export default {
  ...api
};

export const FundingPlansTable = "fundingPlans";

export const AttachmentTables = {

  FundingPlans: FundingPlansTable
}

export const AttachmentTableApiFactory = (key: string): TableApiBase<AttachableDTO>=> {
  switch(key){
  case AttachmentTables.FundingPlans:
    return api.fundingPlanTable
  default:
    throw new Error(`unable to locate api with key ${key}`);
  }
}