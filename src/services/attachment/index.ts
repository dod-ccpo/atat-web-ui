/* eslint-disable camelcase */
import { TableApiBase } from "@/api/tableApiBase";
import { AttachmentDTO, BaseTableDTO } from "@/api/models";
import api from "@/api";
import { TABLENAME as FundingRequestFSFormTableName } from "@/api/fundingRequestFSForm";
import { TABLENAME as FundingRequestMIPRFormTableName } from "@/api/fundingRequestMIPRForm";
import { TABLENAME as RequirementsCostEstimateTableName } from "@/api/requirementsCostEstimate";
import { TABLENAME as CurrentEnvironmentTableName } from "@/api/currentEnvironment";
import { TABLENAME as FairOpportunityTableName } from "@/api/fairOpportunity";
import { TABLENAME as AcquisitionPackageTableName } from "@/api/acquisitionPackages";
import { TABLENAME as PackageDocumentsSignedTableName } from "@/api/packageDocumentsSigned"
import { FundingRequestFSAttachmentService } from "./fundingRequestFSForm";
import { AttachmentServiceBase } from "./base";
import { FundingRequestMIPRAttachmentService } from "./fundingRequestMIPRForm";
import {RequirementsCostEstimateAttachmentService} from
  "@/services/attachment/reqCostEstimateSupportingDocs";
import {CurrentEnvironmentDocumentService} from "@/services/attachment/currentEnvironmentDocument";
import {FairOpportunityDocumentService} from "@/services/attachment/fairOpportunity";
import {AcquisitionPackageDocumentService} from "@/services/attachment/AcquisitionPackage";
import { PackageDocumentsSignedAttachmentService } from
  "@/services/attachment/PackageDocumentsSigned";
export const AttachmentServiceCallbacks = (() => {
  const uploadCallbacks: Record<
    string,
    ((attachment: AttachmentDTO) => void)[]
  > = {};
  const removeCallbacks: Record<
    string,
    ((attachment: AttachmentDTO) => void)[]
  > = {};

  const registerUploadCallBack = (
    serviceKey: string,
    callback: (attachment: AttachmentDTO) => void
  ) => {
    if (!uploadCallbacks[serviceKey]?.length) {
      uploadCallbacks[serviceKey] = [];
    }
    uploadCallbacks[serviceKey].push(callback);
  };

  const registerRemoveCallBack = (
    serviceKey: string,
    callback: (attachment: AttachmentDTO) => void
  ) => {
    if (!removeCallbacks[serviceKey]?.length) {
      removeCallbacks[serviceKey] = [];
    }
    removeCallbacks[serviceKey].push(callback);
  };

  const invokeUploadCallbacks = (
    serviceKey: string,
    attachment: AttachmentDTO
  ) => {
    if (uploadCallbacks[serviceKey]) {
      uploadCallbacks[serviceKey].forEach((callback) => callback(attachment));
    }
  };

  const invokeRemoveCallbacks = (
    serviceKey: string,
    attachment: AttachmentDTO
  ) => {
    if (removeCallbacks[serviceKey]) {
      removeCallbacks[serviceKey].forEach((callback) => callback(attachment));
    }
  };

  return {
    registerUploadCallBack,
    registerRemoveCallBack,
    invokeUploadCallbacks,
    invokeRemoveCallbacks,
  };
})();

//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete
//https://masteringjs.io/tutorials/axios/axios-multi-form-data
//https://stackoverflow.com/questions/17798047/streams-with-percentage-complete

// record manager interface for attachment service
// sub classes that need to do more than just upload and delete 
// attachment records
export interface RecordManager<TModel extends BaseTableDTO> {
  retrieveOrCreate: () => Promise<TModel>;
  updateRecord: (
    record: string,
    attachmentSysId: string,
    fileName: string
  ) => TModel;
  save: (record: string) => Promise<void>;
}

export const AttachmentServiceTypes = {
  FundingPlans: "FundingPlans",
  FundingRequestFSForm: FundingRequestFSFormTableName,
  FundingRequestMIPRForm: FundingRequestMIPRFormTableName,
  RequirementsCostEstimate: RequirementsCostEstimateTableName,
  CurrentEnvironment: CurrentEnvironmentTableName,
  FairOpportunity: FairOpportunityTableName,
  AcquisitionPackage: AcquisitionPackageTableName,
  PackageDocumentsSigned: PackageDocumentsSignedTableName,
};
export const AttachmentServiceFactory = (
  attachmentServiceType: string
): AttachmentServiceBase<TableApiBase<BaseTableDTO>, BaseTableDTO> => {
  switch (attachmentServiceType) {
  case AttachmentServiceTypes.FundingRequestFSForm:
    return new FundingRequestFSAttachmentService(
      attachmentServiceType,
      FundingRequestFSFormTableName,
      api.fundingRequestFSFormTable
    );

  case AttachmentServiceTypes.FundingRequestMIPRForm:
    return new FundingRequestMIPRAttachmentService(
      attachmentServiceType,
      FundingRequestMIPRFormTableName,
      api.fundingRequestMIPRFormTable
    )

  case AttachmentServiceTypes.RequirementsCostEstimate:
    return new RequirementsCostEstimateAttachmentService(
      attachmentServiceType,
      RequirementsCostEstimateTableName,
      api.requirementsCostEstimateTable
    );

  case AttachmentServiceTypes.CurrentEnvironment:
    return new CurrentEnvironmentDocumentService(
      attachmentServiceType,
      CurrentEnvironmentTableName,
      api.currentEnvironmentTable
    );

  case AttachmentServiceTypes.FairOpportunity:
    return new FairOpportunityDocumentService(
      attachmentServiceType,
      FairOpportunityTableName,
      api.fairOpportunityTable
    );
  case AttachmentServiceTypes.AcquisitionPackage:
    return new AcquisitionPackageDocumentService(
      attachmentServiceType,
      AcquisitionPackageTableName,
      api.acquisitionPackageTable
    );
  case AttachmentServiceTypes.PackageDocumentsSigned:
    return new PackageDocumentsSignedAttachmentService(
      attachmentServiceType,
      PackageDocumentsSignedTableName,
      api.packageDocumentsSignedTable
    );
  
  default:
    throw new Error(
      `unable to create service instance for api ${attachmentServiceType}`
    );
  }
};
