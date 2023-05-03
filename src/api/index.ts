import {AcquisitionPackagesApi, AcquisitionPackagesSummaryApi} from "./acquisitionPackages";
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
// import { EDAApi } from "./provisioning";
import { CurrentEnvironmentApi } from "@/api/currentEnvironment";
import { AggregateApi } from "./aggregate";
import { EnvironmentInstanceAPI } from "@/api/EnvironmentInstance";
import { AlertApi } from "./alerts";
import {PortfolioApi} from "@/api/portfolio";
import {CloudServiceProviderApi} from "@/api/cloudServiceProvider";
import {FundingRequirementApi} from "@/api/fundingRequirement";
import { UserApi } from "@/api/user";
import { CompanyApi } from "./companies";
import {EvaluationPlanApi} from "@/api/evaluationPlan";
import {CurrentEnvironmentInstanceAPI} from "@/api/currentEnvironmentInstance";
import {EvalPlanAssessmentAreaApi} from "@/api/evalPlanAssessmentArea";
import {EvalPlanDifferentiatorApi} from "@/api/evalPlanDifferentiator";
import {SelectedClassificationLevelApi} from "@/api/selectedClassificationLevel";
import { SysPropertiesApi } from "./sys_properties";
import { ComputeEnvironmentInstanceAPI } from "@/api/computeEnvironmentInstance";
import { DatabaseEnvironmentInstanceAPI } from "@/api/databaseEnvironmentInstance";
import { StorageEnvironmentInstanceAPI } from "@/api/storageEnvironmentInstance";
import { CloudSupportEnvironmentInstanceAPI } from "@/api/cloudSupportEnvironmentInstance";
import { ArchitecturalDesignRequirementAPI } from "@/api/architecturalDesignRequirement";
import { ClassifiedInformationTypeAPI } from "@/api/classifiedInformationType";
import { XaaSEnvironmentInstanceAPI } from "@/api/xaasEnvironmentInstance";
import { CrossDomainSolutionAPI } from "@/api/crossDomainSolution";
import { GInvoicingApi } from "@/api/gInvoicing";
import { TrainingEstimateAPI } from "@/api/trainingEstimate";
import {IgceEstimateApi} from "@/api/igceEstimate";
import { travelRequirementApi } from "./travelRequirement";
import { RegionsAPI } from "./regions";
import { PackageDocumentsSignedAPI } from "@/api/packageDocumentsSigned";
import { PackageDocumentsUnsignedAPI } from "@/api/packageDocumentsUnsigned";
import { AddressApi } from "@/api/address";
import { CostEstimateApi } from "@/api/costEstimate";


export const api = {

  agencyTable: new AgencyApi(),
  alertsTable: new AlertApi(),
  attachments: new AttachmentApi(),
  systemChoices: new SystemChoicesApi(),
  acquisitionPackageTable: new AcquisitionPackagesApi(),
  acquisitionPackagesSummaryTable: new AcquisitionPackagesSummaryApi(),
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
  fundingRequirementTable: new FundingRequirementApi(),
  currentContractTable: new CurrentContractApi(),
  sensitiveInformationTable: new SensitiveInformationApi(),
  serviceOfferingTable: new ServiceOfferingApi(),
  militaryRankTable: new MilitaryRankApi(),
  periodTable: new PeriodApi(),
  periodOfPerformanceTable: new PeriodOfPerformanceApi(),
  contractTypeTable: new ContractTypeApi(),
  requirementsCostEstimateTable: new RequirementsCostEstimateApi(),
  igceEstimateTable: new IgceEstimateApi(),
  selectedServiceOfferingTable: new SelectedServiceOfferingApi(),
  statesTable: new StatesApi(),
  countriesTable: new CountriesApi(),
  taskOrderTable: new TaskOrderApi(),
  costsTable: new CostsApi(),
  costEstimateTable: new CostEstimateApi(),
  clinTable: new ClinAPi(),
  clinDisplayTable: new ClinDisplayAPi(),
  edaApi: new EDAApi(),
  gInvoicingApi: new GInvoicingApi(),
  currentEnvironmentTable: new CurrentEnvironmentApi(),
  currentEnvironmentInstanceTable: new CurrentEnvironmentInstanceAPI(),
  aggregate: new AggregateApi(),
  environmentInstanceTable: new EnvironmentInstanceAPI(),
  portfolioTable: new PortfolioApi(),
  cloudServiceProviderTable: new CloudServiceProviderApi(),
  userTable: new UserApi(),
  companyTable: new CompanyApi(),
  evaluationPlanTable: new EvaluationPlanApi(),
  evalPlanAssessmentAreaTable: new EvalPlanAssessmentAreaApi(),
  evalPlanDifferentiatorTable: new EvalPlanDifferentiatorApi(),
  selectedClassificationLevelTable: new SelectedClassificationLevelApi(),
  sysProperties: new SysPropertiesApi(),
  computeEnvironmentInstanceTable: new ComputeEnvironmentInstanceAPI(),
  databaseEnvironmentInstanceTable: new DatabaseEnvironmentInstanceAPI(),
  storageEnvironmentInstanceTable: new StorageEnvironmentInstanceAPI(),
  cloudSupportEnvironmentInstanceTable: new CloudSupportEnvironmentInstanceAPI(),
  architecturalDesignRequirementTable: new ArchitecturalDesignRequirementAPI(),
  classifiedInformationTypeTable: new ClassifiedInformationTypeAPI(),
  xaaSEnvironmentInstanceTable: new XaaSEnvironmentInstanceAPI(),
  crossDomainSolutionTable: new CrossDomainSolutionAPI(),
  travelRequirementTable: new travelRequirementApi(),
  trainingEstimateTable: new TrainingEstimateAPI(),
  regionsTable: new RegionsAPI(),
  packageDocumentsSignedTable: new PackageDocumentsSignedAPI(),
  packageDocumentsUnsignedTable: new PackageDocumentsUnsignedAPI(),
  addressTable: new AddressApi(),
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
