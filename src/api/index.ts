import { AcquisitionPackagesApi } from "./acquisitionPackages";
import { ProjectOverviewApi } from "./projectOverview";
import { OrganizationApi } from "./organization";
import { AgencyApi } from "./agency";
import { ContactsApi } from "./contacts";
import { FairOpportunityApi } from "./fairOpportunity";
import { CurrentContractApi } from "./background";
import { ContractConsiderationsApi } from "./contractConsiderations";
import { SensitiveInformationApi } from "./sensitiveInformation";
import { MilitaryRankApi } from "./militaryRanks";
import { SystemChoicesApi } from "./systemChoices";
import { ContractTypeApi, PeriodOfPerformanceApi } from "./contractDetails";
import { GFEOverviewApi } from "./GFEOverview";
import { RequirementsCostEstimateApi } from "./requirementsCostEstimate";
import {StatesApi} from "./states";
import {CountriesApi} from "./countries";
import { FundingPlanApi } from "./fundingPlan";
import { FundingIncrementApi } from "./fundingIncrement"
import { AttachmentApi } from "./attachments";
import { TableApiBase } from "./tableApiBase";
import { AttachableDTO } from "./models";
import { PeriodApi } from "./period";
import { ClassificationLevelApi } from "./classificationLevels";
import { ServiceOfferingApi } from "./serviceOffering";
import { SelectedServiceOfferingApi } from "./selectedServiceOffering";
import { ClassificationInstanceApi } from "./classificationInstance";
import { TaskOrderApi } from "./taskOrder";
import { CostsApi } from "./costs";
import { FundingRequestApi } from "./fundingRequest";
import { FundingRequestFSFormApi } from "./fundingRequestFSForm";
import { FundingRequestMIPRFormApi } from "./fundingRequestMIPRForm";
import {ClinAPi, ClinDisplayAPi} from "./clin";
import { EDAApi } from "./eda";
import { CurrentEnvironmentAPI } from "@/api/currentEnvironment";
import { AggregateApi } from "./aggregate";
import { EnvironmentInstanceAPI } from "@/api/EnvironmentInstance";
import { AlertApi } from "./alerts";
import {PortfolioApi} from "@/api/portfolio";
import {CloudServiceProviderApi} from "@/api/cloudServiceProvider";


export const api = {

  agencyTable: new AgencyApi(),
  alertsTable: new AlertApi(),
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
  fundingRequestTable: new FundingRequestApi(),
  fundingIncrementTable: new FundingIncrementApi(),
  fundingRequestFSFormTable: new FundingRequestFSFormApi(),
  fundingRequestMIPRFormTable: new FundingRequestMIPRFormApi(),
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
  costsTable: new CostsApi(),
  clinTable: new ClinAPi(),
  clinDisplayTable: new ClinDisplayAPi(),
  edaApi: new EDAApi(),
  currentEnvironmentTable: new CurrentEnvironmentAPI(),
  aggregate: new AggregateApi(),
  environmentInstanceTable: new EnvironmentInstanceAPI(),
  portfolioTable: new PortfolioApi(),
  cloudServiceProviderTable: new CloudServiceProviderApi()
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
