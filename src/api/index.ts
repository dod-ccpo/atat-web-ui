import { AcquisitionPackagesApi } from "./acquisitionPackages";
import { ProjectOverviewApi } from "./projectOverview";
import { OrganizationApi } from "./organization";
import { ContactsApi } from "./contacts";
import { FairOpportunityApi } from "./fairOpportunity";
import { CurrentContractApi } from "./background";
import { SensitiveInformationApi } from "./otherContractConsiderations";
import { MilitaryRankApi } from "./militaryRanks";
import { SystemChoicesApi } from "./systemChoices";
import { ContractTypeApi, PeriodOfPerformanceApi } from "./contractDetails";
import { GFEOverviewApi } from "./GFEOverview";
import { RequirementsCostEstimateApi } from "./requriementsCostEstimate";
import { FundingPlanApi } from "./fundingPlan";
import { AttachmentApi } from "./attachments";

export default {
  attachments: new AttachmentApi(),
  systemChoices: new SystemChoicesApi(),
  acquisitionPackageTable: new AcquisitionPackagesApi(),
  projectOverviewTable: new ProjectOverviewApi(),
  organizationTable: new OrganizationApi(),
  contactsTable: new ContactsApi(),
  fairOpportunityTable: new FairOpportunityApi(),
  fundingPlanTable :new FundingPlanApi(),
  currentContractTable: new CurrentContractApi(),
  sensitiveInformationTable: new SensitiveInformationApi(),
  militaryRankTable: new MilitaryRankApi(),
  periodOfPerformanceTable: new PeriodOfPerformanceApi(),
  gfeOverviewTable: new GFEOverviewApi(),
  contractTypeTable: new ContractTypeApi(),
  requirementsCostEstimateTable: new RequirementsCostEstimateApi(),
};
