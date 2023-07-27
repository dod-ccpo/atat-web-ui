/* eslint-disable camelcase */
import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import rootStore from "../index";
import api from "@/api";
import {
  ArchitecturalDesignRequirementDTO,
  BaseTableDTO,
  ClassificationInstanceDTO,
  CloudServiceProviderDTO,
  CloudSupportEnvironmentInstanceDTO,
  ComputeEnvironmentInstanceDTO,
  DatabaseEnvironmentInstanceDTO,
  EnvironmentInstanceDTO,
  PeriodDTO,
  ReferenceColumn, SelectedClassificationLevelDTO,
  SelectedServiceOfferingDTO,
  ServiceOfferingDTO,
  StorageEnvironmentInstanceDTO,
  SystemChoiceDTO, TravelRequirementDTO,
  XaasEnvironmentInstanceDTO
} from "@/api/models";
import {TABLENAME as ServiceOfferingTableName } from "@/api/serviceOffering"
import {
  nameofProperty,
  storeDataToSession,
  retrieveSession,
} from "../helpers";
import Vue from "vue";
import {
  DOWServiceOfferingGroup,
  DOWServiceOffering,
  DOWClassificationInstance,
  OtherServiceOfferingData,
  StorageUnit,
  RadioButton,
  SecurityRequirement,
  TravelSummaryTableData,
} from "../../../types/Global";

import _, { differenceWith, first, last } from "lodash";
import ClassificationRequirements from "@/store/classificationRequirements";
import AcquisitionPackage from "../acquisitionPackage";
import Periods from "../periods";
import IGCEStore, { createCostEstimateDescription } from "@/store/IGCE";
import { 
  buildClassificationLabel, 
  toTitleCase, 
  capitalizeEachWord,
} from "@/helpers";
import { AxiosRequestConfig } from "axios";
import { convertColumnReferencesToValues } from "@/api/helpers";
import { TableApiBase } from "@/api/tableApiBase";


// Classification Proxy helps keep track of saved
// Classification Instances so we can efficiently
// update the DOW object
type ClassificationInstanceProxy = {
  dowClassificationInstanceIndex: number;
  classificationInstance: ClassificationInstanceDTO;
}
// service proxy type for saving service offerings
// and associated classification instances
// helps keep track of changes and updating dow object
type ServiceOfferingProxy =  {
  serviceOffering: SelectedServiceOfferingDTO,
  classificationInstances: ClassificationInstanceProxy[]
  dowServiceGroupIndex: number,
  dowServiceIndex: number
}

export const saveOrUpdateSelectedServiceOffering =
    async (
      selectedServiceOffering: DOWServiceOffering,
      serviceOfferingId: string
    ):Promise<string> => {
      const tempObject: any = {};
      let objSysId = "";
      const classificationInstances: string[] = [];
      if(selectedServiceOffering.classificationInstances &&
          selectedServiceOffering.classificationInstances.length > 0){

        if(selectedServiceOffering.classificationInstances.length > 1) {
          selectedServiceOffering.classificationInstances.forEach(item => {
            const tempId = typeof item.sysId === "object"
              ? (item.sysId as ReferenceColumn).value as string
              : item.sysId;
            classificationInstances.push(tempId as string);
          })
        } else {
          const item = selectedServiceOffering.classificationInstances[0];
          const tempId = typeof item.sysId === "object"
            ? (item.sysId as ReferenceColumn).value as string
            : item.sysId;

          classificationInstances.push(tempId as string);
        }
      }

      //TODO: set this to an actual value
      tempObject.architectural_design_requirement = "";

      tempObject.classification_instances = classificationInstances.join(",") || "";

      tempObject.acquisition_package = AcquisitionPackage.packageId;
      tempObject.other_service_offering = selectedServiceOffering.otherOfferingName;
      tempObject.service_offering = serviceOfferingId;

      if(selectedServiceOffering.sys_id)
        tempObject.sys_id = selectedServiceOffering.sys_id;

      if(tempObject.sys_id){
        await api.selectedServiceOfferingTable.update(
          tempObject.sys_id,
          tempObject
        );
        objSysId = tempObject.sys_id;
      } else {
        const savedObject = await api.selectedServiceOfferingTable.create(
          tempObject
        );
        objSysId = savedObject.sys_id as string;
      }

      return objSysId;
    };

const saveOrUpdateClassificationInstance =
    async (
      classificationInstance: DOWClassificationInstance,
      title: string,
      serviceOfferingName: string
    ):Promise<string> => {
      const tempObject: any = {};
      let objSysId = "";


      const unit_quantity = await stringifyPeriodsForIGCECostEstimates(
        classificationInstance.selectedPeriods
      );

      if(classificationInstance.selectedPeriods){
        tempObject.selected_periods = classificationInstance.selectedPeriods.join(",") || "";
      }
      const classificationLevel =
          typeof classificationInstance.classificationLevelSysId === "object"
            ? (classificationInstance.classificationLevelSysId as ReferenceColumn).value as string
            : classificationInstance.classificationLevelSysId as string;
      tempObject.classification_level = classificationLevel;
      tempObject.acquisition_package = AcquisitionPackage.acquisitionPackage?.sys_id;
      tempObject.usage_description = classificationInstance.anticipatedNeedUsage;
      tempObject.need_for_entire_task_order_duration = classificationInstance.entireDuration;
      tempObject.type_of_delivery = classificationInstance.typeOfDelivery;
      tempObject.type_of_mobility = classificationInstance.typeOfMobility;
      tempObject.type_of_mobility_other = classificationInstance.typeOfMobilityOther;
      tempObject.classified_information_types = classificationInstance.classifiedInformationTypes;
      tempObject.ts_contractor_clearance_type = classificationInstance.tsContractorClearanceType;
      
      const dowTaskNumber = await createDOWTaskNumber(
        classificationInstance.classificationLevelSysId as string, 
        title, 
      );
      if(classificationInstance.sysId)
        tempObject.sys_id = classificationInstance.sysId;

      if(tempObject.sys_id){
        objSysId = tempObject.sys_id;
        await api.classificationInstanceTable.update(
          tempObject.sys_id,
            tempObject as ClassificationInstanceDTO
        );

        await IGCEStore.updateIgceEstimateRecord({
          classificationInstanceSysId: objSysId,
          classificationLevelSysId: classificationLevel,
          unit_quantity,
          description: tempObject.usage_description,
          dow_task_number: dowTaskNumber
        });
      } else {
        const savedObject = await api.classificationInstanceTable.create(
            tempObject as ClassificationInstanceDTO
        );
        objSysId = savedObject.sys_id as string;
        await IGCEStore.createIgceEstimateClassificationInstance({
          classificationInstanceSysId: objSysId,
          classificationLevelSysId: savedObject.classification_level,
          title: capitalizeEachWord(title, "_") + " - " + serviceOfferingName,
          description: classificationInstance.anticipatedNeedUsage,
          idiqClinType: "CLOUD",
          unit_quantity,
          dow_task_number: dowTaskNumber
        });
      }

      return objSysId;
    };

// prep global period selection as stringified obj to store in IGCE Cost Estimate table
export const stringifyPeriodsForIGCECostEstimates =
    async(customPeriods?: string[]):Promise<string> =>{
      const periodsToStringify: {[x: string]: string} = {};
      const globalPeriods = await Periods.loadPeriods();
      let periodsToUse: PeriodDTO[] = [];

      if (customPeriods && customPeriods.length>0){
        periodsToUse = globalPeriods.filter(
          period => {
            return customPeriods.some(sysId => sysId === period.sys_id);
          }
        )
      } else {
        periodsToUse = globalPeriods;
      }

      periodsToUse.forEach(
        ({ sys_id , period_unit_count })=>(
          periodsToStringify[sys_id?.toString() || ""] = period_unit_count
        )
      )
      return JSON.stringify(periodsToStringify);
    }

export const saveOrUpdateOtherServiceOffering =
    async (
      serviceOffering: OtherServiceOfferingData,
      offeringType: string
    ):Promise<string> => {
      const tempObject: any = {};
      let objSysId = "";
      let idiqClinType = "CLOUD";
      const unit_quantity = await stringifyPeriodsForIGCECostEstimates(
        serviceOffering.periodsNeeded
      );
      tempObject.acquisition_package = AcquisitionPackage.packageId;
      tempObject.anticipated_need_or_usage = serviceOffering.descriptionOfNeed;
      tempObject.classification_level = serviceOffering.classificationLevel;
      tempObject.licensing = serviceOffering.licensing;
      tempObject.memory_amount = serviceOffering.memoryAmount;
      tempObject.memory_unit = serviceOffering.memoryUnit || "GB";
      tempObject.number_of_instances = serviceOffering.numberOfInstances;
      /* TODO: PLZ HAVE PLATFORM TEAM FIX CASE TO UPPERCASE TO REMOVE THIS HACK!!! */
      tempObject.need_for_entire_task_order_duration = serviceOffering.entireDuration.toLowerCase();
      tempObject.need_for_entire_task_order_duration = serviceOffering.entireDuration.toLowerCase();
      tempObject.number_of_vcpus = serviceOffering.numberOfVCPUs;
      tempObject.operating_system = serviceOffering.operatingSystem;
      tempObject.performance_tier = serviceOffering.performanceTier;
      tempObject.processor_speed = serviceOffering.processorSpeed;
      tempObject.region = serviceOffering.region;


      // if no custom selected periods         
      tempObject.selected_periods = serviceOffering.periodsNeeded.join(",");
      tempObject.storage_amount = serviceOffering.storageAmount;
      tempObject.storage_type = serviceOffering.storageType;
      tempObject.storage_unit = serviceOffering.storageUnit;
      tempObject.classified_information_types = serviceOffering.classifiedInformationTypes;
      tempObject.instance_number = serviceOffering.instanceNumber;
      const dowTaskNumber = await createDOWTaskNumber(
          serviceOffering.classificationLevel as string, 
          offeringType, 
          serviceOffering.instanceNumber
      );

      if(serviceOffering.sysId)
        tempObject.sys_id = serviceOffering.sysId;
      let title = serviceGroupVerbiageInfo[offeringType.toUpperCase()].offeringName;
      let instanceType = "Instance";
      switch(offeringType){
      case "compute":
        tempObject.instance_name = "Compute Instance #" + serviceOffering.instanceNumber;
        tempObject.environment_type = serviceOffering.environmentType;
        tempObject.operating_environment = serviceOffering.operatingEnvironment;
        tempObject.operating_system_licensing = serviceOffering.operatingSystemAndLicensing;
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;
          await api.computeEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as ComputeEnvironmentInstanceDTO
          );
          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            dow_task_number: dowTaskNumber,
            description: createCostEstimateDescription(
              "compute",
              serviceOffering
            ),
          });
        } else {
          const savedObject = await api.computeEnvironmentInstanceTable.create(
                tempObject as ComputeEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          await IGCEStore.createIgceEstimateEnvironmentInstance({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: savedObject.classification_level,
            title: title + " - " + instanceType + " #" + serviceOffering.instanceNumber,
            description: savedObject.anticipated_need_or_usage,
            unit: "month",
            otherServiceOfferingData: serviceOffering,
            offeringType,
            idiqClinType,
            unit_quantity,
            dowTaskNumber
          });
        }
        break;
      case "database":
        tempObject.instance_name = "Database Instance #" + serviceOffering.instanceNumber;
        tempObject.database_licensing = serviceOffering.databaseLicensing;
        tempObject.database_type = serviceOffering.databaseType;
        tempObject.database_type_other = serviceOffering.databaseTypeOther;
        tempObject.network_performance = serviceOffering.networkPerformance;
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;

          await api.databaseEnvironmentInstanceTable.update(
            objSysId,
                tempObject as DatabaseEnvironmentInstanceDTO
          );

          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            dow_task_number: dowTaskNumber,
            description: createCostEstimateDescription(
              "database",
              serviceOffering
            ),
          });

        } else {
          const savedObject = await api.databaseEnvironmentInstanceTable.create(
                tempObject as DatabaseEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          await IGCEStore.createIgceEstimateEnvironmentInstance({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: savedObject.classification_level,
            title: title + " - " + instanceType + " #" + serviceOffering.instanceNumber,
            description: savedObject.anticipated_need_or_usage,
            unit: "month",
            otherServiceOfferingData: serviceOffering,
            offeringType,
            idiqClinType,
            unit_quantity,
            dowTaskNumber
          });
        }
        break;
      case "storage":
        tempObject.instance_name = "Storage Instance #" + serviceOffering.instanceNumber;
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;
          await api.storageEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as StorageEnvironmentInstanceDTO
          );

          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            dow_task_number: dowTaskNumber,
            description: createCostEstimateDescription(
              "storage",
              serviceOffering
            ),
          });
        } else {
          const savedObject = await api.storageEnvironmentInstanceTable.create(
                tempObject as StorageEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          await IGCEStore.createIgceEstimateEnvironmentInstance({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: savedObject.classification_level,
            title: title + " - " + instanceType + " #" + serviceOffering.instanceNumber,
            description: savedObject.anticipated_need_or_usage,
            unit: "month",
            otherServiceOfferingData: serviceOffering,
            offeringType,
            idiqClinType,
            unit_quantity,
            dowTaskNumber
          });
        }
        break;
      case "general_xaas":
        tempObject.instance_name = "Requirement #" + serviceOffering.instanceNumber;
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;
          await api.xaaSEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as XaasEnvironmentInstanceDTO
          )

          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            description:tempObject.anticipated_need_or_usage,
            dow_task_number: dowTaskNumber,
          });
        } else {
          const savedObject = await api.xaaSEnvironmentInstanceTable.create(
                tempObject as XaasEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          instanceType = serviceOffering.requirementTitle || "Requirement"
          await IGCEStore.createIgceEstimateEnvironmentInstance({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: savedObject.classification_level,
            title: title + " - " + instanceType + " #" + serviceOffering.instanceNumber,
            description: savedObject.anticipated_need_or_usage,
            unit: "month",
            otherServiceOfferingData: serviceOffering,
            offeringType,
            idiqClinType,
            unit_quantity,
            dowTaskNumber
          });
        }
        break;
      case "advisory_assistance":
      case "help_desk_services":
      case "documentation_support":
      case "general_cloud_support":
      case "training":
        tempObject.can_train_in_unclass_env = serviceOffering.canTrainInUnclassEnv;
        tempObject.personnel_onsite_access = serviceOffering.personnelOnsiteAccess;
        tempObject.personnel_requiring_training = serviceOffering.trainingPersonnel;
        tempObject.instance_name =
            toTitleCase(offeringType
              .replaceAll("_", " ")) + " #" + serviceOffering.instanceNumber;
        tempObject.service_type = offeringType.toUpperCase();

        if (offeringType === "training"){
          tempObject.training_facility_type = serviceOffering.trainingFacilityType;
          tempObject.training_format = serviceOffering.trainingType;
          tempObject.training_location = serviceOffering.trainingLocation;
          tempObject.training_requirement_title = serviceOffering.trainingRequirementTitle;
          tempObject.training_time_zone = serviceOffering.trainingTimeZone;
        }

        tempObject.ts_contractor_clearance_type = serviceOffering.tsContractorClearanceType;

        instanceType = "Service";
        idiqClinType =  "CLOUD_SUPPORT"
        title = title + " - " + instanceType + " #" + serviceOffering.instanceNumber
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;
          await api.cloudSupportEnvironmentInstanceTable.update(
            tempObject.sys_id,
              tempObject as CloudSupportEnvironmentInstanceDTO
          );
          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            description:tempObject.anticipated_need_or_usage,
            dow_task_number: dowTaskNumber
          });

        } else {
          const savedObject = await api.cloudSupportEnvironmentInstanceTable.create(
              tempObject as CloudSupportEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          if (offeringType !== "training"){
            await IGCEStore.createIgceEstimateEnvironmentInstance({
              environmentInstanceSysId: objSysId,
              classificationLevelSysId: savedObject.classification_level,
              title: title,
              description: savedObject.anticipated_need_or_usage,
              unit: "month",
              otherServiceOfferingData: serviceOffering,
              offeringType,
              idiqClinType,
              unit_quantity,
              dowTaskNumber: dowTaskNumber
            });
          }
        }
        break;
      case "portability_plan":
        title = toTitleCase(offeringType.replaceAll("_", " "));
        tempObject.can_train_in_unclass_env = serviceOffering.canTrainInUnclassEnv;
        tempObject.personnel_onsite_access = serviceOffering.personnelOnsiteAccess;
        tempObject.personnel_requiring_training = serviceOffering.trainingPersonnel;
        tempObject.instance_name = title + " #" + serviceOffering.instanceNumber;
        tempObject.service_type = offeringType.toUpperCase();

        tempObject.ts_contractor_clearance_type = serviceOffering.tsContractorClearanceType;
        instanceType = "Service";
        idiqClinType =  "CLOUD_SUPPORT"
        if(tempObject.sys_id){
          objSysId = tempObject.sys_id;
          await api.cloudSupportEnvironmentInstanceTable.update(
            tempObject.sys_id,
              tempObject as CloudSupportEnvironmentInstanceDTO
          );
          await IGCEStore.updateIgceEstimateRecord({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: tempObject.classification_level,
            unit_quantity,
            description:tempObject.anticipated_need_or_usage,
            dow_task_number: dowTaskNumber,
          });

        } else {
          const savedObject = await api.cloudSupportEnvironmentInstanceTable.create(
              tempObject as CloudSupportEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
          await IGCEStore.createIgceEstimateEnvironmentInstance({
            environmentInstanceSysId: objSysId,
            classificationLevelSysId: savedObject.classification_level,
            title: title,
            description: savedObject.anticipated_need_or_usage,
            unit: "each",
            otherServiceOfferingData: serviceOffering,
            offeringType,
            idiqClinType,
            unit_quantity,
            dowTaskNumber:dowTaskNumber
          });
        }
        break;
      default:
        console.log("DOW object saving for this type is not implemented yet.");
        objSysId = "";
        break;
      }

      return objSysId;
    };


export const createDOWTaskNumber = async(
  classificationLevel: string,
  offeringType: string,
  instanceNumber?: number
): Promise<string> =>{
  // get DOW Task Number associated with selected classification
  const classificationDOWTaskNumberComponent = 
  ClassificationRequirements.classificationLevels.find(
    cr => cr.sys_id === classificationLevel
  )?.dow_task_number_component

  // get the offering from the store
  const offeringInfo = DescriptionOfWork.serviceOfferings.find(
    so => so.service_offering_group.toUpperCase() === offeringType.toUpperCase()
  )
  const isXaas = offeringInfo?.offering_type === "XAAS_SERVICE";

  /**
   * Business Rule: for XAAS service offerings WITHOUT instance numbers
   * increment the instance numbers based on classification levels 
   * examples
   * Applications - Web App      - IL2 -> 4.2.1.3.1
   * Applications - Monit. Tools - IL5 -> 4.2.3.3.1
   * Applications - Database     - IL5 -> 4.2.3.3.2
   * Applications - SaaS         - IL5 -> 4.2.3.3.3
  */ 
  if (instanceNumber === undefined && isXaas){
    const serviceOfferings = DescriptionOfWork.DOWObject.find(
      dow => dow.serviceOfferingGroupId === offeringType
    )?.serviceOfferings
    const totalExistingClassLevels = 
      (JSON.stringify(serviceOfferings))
        .match(new RegExp( classificationLevel, 'g' ))?.length || 0
    instanceNumber = totalExistingClassLevels + 1;
  }
  let dow_task_number_component = offeringInfo?.dow_task_number_component
  let section = isXaas ? "4.2" : "4.3";

  if (offeringType === "general_xaas"){
    dow_task_number_component = 11;
    section = "4.2";
  }
  if(offeringType === "portability_plan"){
    return section +
        "." + classificationDOWTaskNumberComponent
  }
  
  return section +
    "." + classificationDOWTaskNumberComponent +
    "." + dow_task_number_component +
    "." + instanceNumber
}


const mapClassificationInstanceFromDTO = (
  value: ClassificationInstanceDTO
): DOWClassificationInstance => {
  value = convertColumnReferencesToValues(value);
  const classificationLevel = ClassificationRequirements.classificationLevels.find((item) => {
    const sysId =
        typeof value.classification_level === "object"
          ? (value.classification_level as ReferenceColumn).value as string
          : value.classification_level as string;
    return item.sys_id === sysId
  });
  const labelLong = classificationLevel
    ? buildClassificationLabel(classificationLevel, "long") : "";
  const labelShort = classificationLevel
    ? buildClassificationLabel(classificationLevel, "short") : "";
  const selectedPeriods: string[] = [];
  if(value.selected_periods !== "") {
    const periods = value.selected_periods.split(",");
    periods.forEach(period => {
      const selectedPeriod = Periods.periods.find((item) => {
        return item.sys_id = period;
      });
      if(selectedPeriod){
        selectedPeriods.push(selectedPeriod.sys_id || "");
      }

    })
  }
  const result: DOWClassificationInstance = {
    anticipatedNeedUsage: value.usage_description,
    classificationLevelSysId: value.classification_level,
    entireDuration: value.need_for_entire_task_order_duration,
    selectedPeriods: selectedPeriods,
    impactLevel: classificationLevel?.impact_level || "",
    labelLong: labelLong,
    labelShort: labelShort,
    typeOfDelivery: value.type_of_delivery,
    typeOfMobility: value.type_of_mobility,
    typeOfMobilityOther: value.type_of_mobility_other,
    tsContractorClearanceType: value.ts_contractor_clearance_type,
    classifiedInformationTypes: value.classified_information_types,
    sysId: value.sys_id,
    acquisitionPackage: AcquisitionPackage.acquisitionPackage?.sys_id as string
  };

  return result;
};

const mapOtherOfferingFromDTO = (
  index: number,
  value: ComputeEnvironmentInstanceDTO |
        DatabaseEnvironmentInstanceDTO |
        StorageEnvironmentInstanceDTO |
        CloudSupportEnvironmentInstanceDTO |
        XaasEnvironmentInstanceDTO
): OtherServiceOfferingData => {

  value = convertColumnReferencesToValues(value);
  const result: OtherServiceOfferingData = {
    acquisitionPackageSysId: AcquisitionPackage.packageId,
    descriptionOfNeed: value.anticipated_need_or_usage,
    classificationLevel: value.classification_level as string,
    requirementTitle: value.instance_name,
    licensing: value.operating_system_licensing,
    memoryAmount: value.memory_amount,
    numberOfInstances: value.number_of_instances,
    /* TODO: PLZ HAVE PLATFORM TEAM FIX CASE TO UPPERCASE TO REMOVE THIS HACK!!! MKAY? */
    entireDuration: value.need_for_entire_task_order_duration.toUpperCase(),
    numberOfVCPUs: value.number_of_vcpus,
    operatingSystem: value.operating_system,
    performanceTier: value.performance_tier,
    processorSpeed: value.processor_speed,
    region: value.region as string,
    periodsNeeded: value.selected_periods && value.selected_periods.length>0
      ? value.selected_periods?.split(",")
      : [],
    storageAmount: value.storage_amount,
    storageType: value.storage_type,
    storageUnit: value.storage_unit as StorageUnit,
    sysId: value.sys_id,
    instanceNumber: index,
    classifiedInformationTypes: value.classified_information_types,
  };

  if("environment_type" in value){
    result.environmentType = value.environment_type;
    result.operatingEnvironment = value.operating_environment;
    result.operatingSystemAndLicensing = value.operating_system_licensing;
  }

  if("database_licensing" in value){
    result.databaseLicensing = value.database_licensing;
    result.databaseType = value.database_type;
    result.databaseTypeOther = value.database_type_other;
    result.networkPerformance = value.network_performance;
  }

  if("service_type" in value){
    result.canTrainInUnclassEnv = value.can_train_in_unclass_env;
    result.personnelOnsiteAccess = value.personnel_onsite_access;
    result.trainingPersonnel = value.personnel_requiring_training;
    result.serviceType = value.service_type;
    result.trainingFacilityType = value.training_facility_type;
    result.trainingType = value.training_format;
    result.trainingLocation = value.training_location;
    result.trainingRequirementTitle = value.training_requirement_title;
    result.trainingTimeZone = value.training_time_zone;
    result.tsContractorClearanceType = value.ts_contractor_clearance_type;
  }

  return result;
};

const ATAT_DESCRIPTION_OF_WORK_KEY = "ATAT_DESCRIPTION_OF_WORK_KEY";

const serviceGroupVerbiageInfo: Record<string, Record<string, string>> = {
  COMPUTE: {
    offeringName: "Compute",
    headingDetails1: "Compute",
    heading2: "Compute Instance",
    headingSummary: "Compute Requirements",
    typeForUsage: "instance",
    typeForText: "instance",
    introText: `each Compute instance that you need.`,
  },
  DATABASE: {
    offeringName: "Database",
    heading2: "Database Instance",
    headingSummary: "Database Requirements",
    typeForUsage: "requirement",
    typeForText: "instance",
    introText: `each Database instance that you need.`,
  },
  STORAGE: {
    offeringName: "Storage",
    heading2: "Storage Instance",
    headingSummary: "Storage Requirementss",
    typeForUsage: "requirement",
    typeForText: "instance",
    introText: `each Storage instance that you need, separate from your 
      Compute and Database requirements.`,
  },
  GENERAL_XAAS: {
    offeringName: "General IaaS, PaaS, and SaaS",
    heading2: "Requirement",
    headingSummary: "General IaaS, PaaS, and SaaS Requirements",
    typeForUsage: "requirement",
    typeForText: "requirement",
    introText: `any third-party marketplace solutions or cloud resources not covered 
      in the other Anything as a Service (XaaS) categories.`,
  },
  ADVISORY_ASSISTANCE: {
    offeringName: "Advisory and Assistance",
    heading2: "Advisory and Assistance Services",
    headingSummary: "Advisory and Assistance",
    typeForUsage: "service",
    typeForText: "service",
    introText: `each Advisory and Assistance service that you need.`,
  },
  HELP_DESK_SERVICES: {
    offeringName: "Help Desk Services",
    heading2: "Help Desk Service",
    headingSummary: "Help Desk Services",
    typeForUsage: "service",
    typeForText: "service",
    introText: `each Help Desk Service that you need`,
  },
  TRAINING: {
    offeringName: "Training",
    heading2: "Training",
    headingSummary: "Training Requirements",
    typeForUsage: "training",
    typeForText: "training",
    introText: `each training that you need.`,
  },
  DOCUMENTATION_SUPPORT: {
    offeringName: "Documentation Support",
    heading2: "Documentation Support",
    headingSummary: "Documentation Support Services",
    typeForUsage: "service",
    typeForText: "service",
    introText: `each Documentation Support service that you need.`,
  },
  GENERAL_CLOUD_SUPPORT: {
    offeringName: "General Cloud Support",
    heading2: "Cloud Support Service",
    headingSummary: "General Cloud Support Services",
    typeForUsage: "service",
    typeForText: "service",
    introText: `any other cloud support services that you need.`,
  },
  PORTABILITY_PLAN: {
    offeringName: "Portability Plan",
    heading2: "Portability Plan",
    headingSummary: "Portability Plan Services",
    typeForUsage: "service",
    typeForText: "service",
    introText: `each Portability Plan service that you need.`,
  },
}

export const instanceEnvTypeOptions: RadioButton[] = [
  {
    id: "DevTesting",
    label: "Dev/Testing",
    value: "DEV_TEST",
  },
  {
    id: "PreProdStaging",
    label: "Pre-production",
    value: "PRE_PROD",
  },
  {
    id: "Production",
    label: "Production/Staging",
    value: "PROD_STAGING",
  },
  {
    id: "COOP",
    label: "Continuity of Operations Planning (COOP)/Disaster Recovery",
    value: "COOP_DISASTER_RECOVERY"
  }
];

export const trainingTypeOptions: RadioButton[] = [
  {
    id: "OnSiteCONUS",
    label: "On-site instructor-led within the Continental United States (CONUS)",
    value: "ONSITE_INSTRUCTOR_CONUS",
  },
  {
    id: "OnSiteOCONUS",
    label: "On-site instructor-led outside of the Continental United States (OCONUS)",
    value: "ONSITE_INSTRUCTOR_OCONUS",
  },
  {
    id: "VirturalInstructorLed",
    label: "Virtual instructor-led",
    value: "VIRTUAL_INSTRUCTOR",
  },
  {
    id: "VirtualSelfLed",
    label: "Virtual self-led",
    value: "VIRTUAL_SELF_LED",
  },
  {
    id: "NoPreference",
    label: "No preference",
    value: "NO_PREFERENCE",
  },
];

export const defaultDOWArchitecturalNeeds: ArchitecturalDesignRequirementDTO = {
  source: "DOW",
  statement: "",
  applications_needing_design: "",
  data_classification_levels: "",
  external_factors: "",
  acquisition_package: "",
  needs_architectural_design_services:""
}

const deleteOtherOfferingInstanceFromSNOW = (sysId: string, groupId: string) => {
  switch (groupId.toLowerCase()) {
  case "compute":
    api.computeEnvironmentInstanceTable.remove(sysId);
    break;
  case "database":
    api.databaseEnvironmentInstanceTable.remove(sysId);
    break;
  case "storage":
    api.storageEnvironmentInstanceTable.remove(sysId);
    break;
  case "general_xaas":
    api.xaaSEnvironmentInstanceTable.remove(sysId);
    break;
  case "advisory_assistance":
  case "help_desk_services":
  case "documentation_support":
  case "general_cloud_support":
  case "training":
  case "portability_plan":
    api.cloudSupportEnvironmentInstanceTable.remove(sysId);
  }
}

const deleteOtherOfferingInstanceFromIGCECostEstimate = (
  envSysId: string,
  serviceOfferingGroupId: string) => {
  IGCEStore.deleteIgceEstimateEnvironmentInstance({envSysId, serviceOfferingGroupId});
}


@Module({
  name: "DescriptionOfWork",
  namespaced: true,
  dynamic: true,
  store: rootStore,
})

export class DescriptionOfWorkStore extends VuexModule {
  initialized = false;
  isIncomplete = true;
  serviceOfferings: ServiceOfferingDTO[] = [];
  serviceOfferingGroups: SystemChoiceDTO[] = [];

  // selectedOfferingGroups: stringObj[] = [];
  DOWObject: DOWServiceOfferingGroup[] = [];

  //list of required services -- this is synchronized to back end
  userSelectedServiceOfferings: SelectedServiceOfferingDTO[] = [];

  currentGroupId = "";
  currentOfferingName = "";
  currentOfferingSysId = "";
  xaaSNoneValue = "XaaS_NONE";
  cloudNoneValue = "Cloud_NONE";
  hasXaasService = false;
  hasCloudService = false;
  XaaSNoneSelected = false;
  cloudNoneSelected = false;
  returnToDOWSummary = false;
  fromAnticipatedUsersAndData = false;
  reviewGroupFromSummary = false;
  addGroupFromSummary = false;
  isDOWComplete = false;
  isDOWSummaryAlertOpen = true;
  @Action
  public setIsDOWSummaryAlertOpen(open: boolean): void {
    this.doSetIsDOWSummaryAlertOpen(open);
  }
  @Mutation
  public doSetIsDOWSummaryAlertOpen(open: boolean): void {
    this.isDOWSummaryAlertOpen = open;
  }

  @Action
  public async setIsDOWComplete(isComplete: boolean): Promise<void> {
    this.doSetIsDOWComplete(isComplete);
  }
  @Mutation
  public doSetIsDOWComplete(isComplete: boolean): void {
    this.isDOWComplete = isComplete;
  }
  currentDOWSection = "";
  @Action
  public async setCurrentDOWSection(section: string): Promise<void> {
    this.doSetCurrentDOWSection(section);
  }
  @Mutation
  public doSetCurrentDOWSection(section: string): void {
    this.currentDOWSection = section;
  }


  xaasServices = [
    'STORAGE',
    'DATABASE',
    'GENERAL_XAAS',
    'IOT',
    'EDGE_COMPUTING',
    'SECURITY',
    'NETWORKING',
    'MACHINE_LEARNING',
    'APPLICATIONS',
    'DEVELOPER_TOOLS',
    'COMPUTE',
  ];

  cloudSupportServices = [
    "PORTABILITY_PLAN",
    "ADVISORY_ASSISTANCE",
    "HELP_DESK_SERVICES",
    "TRAINING",
    "DOCUMENTATION_SUPPORT",
    "GENERAL_CLOUD_SUPPORT",
  ]

  public otherServiceOfferings = [
    "COMPUTE",
    "DATABASE",
    "STORAGE",
    "GENERAL_XAAS",
    "ADVISORY_ASSISTANCE",
    "HELP_DESK_SERVICES",
    "TRAINING",
    "DOCUMENTATION_SUPPORT",
    "GENERAL_CLOUD_SUPPORT",
  ];

  public offeringsThatNeedSecurityRequirements = [
    "ADVISORY_ASSISTANCE",
    "HELP_DESK_SERVICES",
    "TRAINING",
    "DOCUMENTATION_SUPPORT",
    "GENERAL_CLOUD_SUPPORT",
    "EDGE_COMPUTING",
  ];

  public get DOWSecReqOfferingName(): string {
    // returns current service offering if tactical edge,
    // or group name if other offering
    if (this.currentGroupId === "EDGE_COMPUTING") {
      return this.currentOfferingName;
    }
    const groupObj = this.serviceOfferingGroups.find(
      obj => obj.value === this.currentGroupId
    );
    return groupObj ? groupObj.label : "service offering";
  }

  public serviceNeedsSecurityRequirements = false;

  @Action({rawError: true})
  public async setNeedsSecurityRequirements(): Promise<void> {
    const needsSecurityRequirements
        = this.offeringsThatNeedSecurityRequirements.includes(this.currentGroupId);
    await this.doSetNeedsSecurityRequirements(needsSecurityRequirements);
    await this.setShowSecurityRequirements();
  }
  @Mutation
  public async doSetNeedsSecurityRequirements(value: boolean): Promise<void> {
    this.serviceNeedsSecurityRequirements = value;
    if (value === false) {
      DescriptionOfWork.resetShowSecurityRequirements();
    }
  }

  public showSecurityRequirements = false;

  @Action({rawError: true})
  public resetShowSecurityRequirements(): void {
    this.doResetShowSecurityRequirements();
  }
  @Mutation
  public doResetShowSecurityRequirements(): void {
    this.showSecurityRequirements = false;
  }

  @Action({rawError: true})
  public async setShowSecurityRequirements(): Promise<void> {
    // "high side" is secret or above
    const highSideSysIds = ClassificationRequirements.highSideSysIds;
    let highSideInstances = undefined;

    if (this.offeringsThatNeedSecurityRequirements.includes(this.currentGroupId)) {
      const offeringGroupObj = this.DOWObject.find(
        obj => obj.serviceOfferingGroupId === this.currentGroupId
      );

      if (offeringGroupObj) {
        if (!this.otherServiceOfferings.includes(this.currentGroupId)) {
          // check classificationInstances object
          const offering = offeringGroupObj.serviceOfferings.find(
            obj => obj.name === this.currentOfferingName
          );
          if (offering) {
            highSideInstances = offering.classificationInstances?.filter(
              obj => highSideSysIds.includes(obj.classificationLevelSysId)
            );
          }
        } else {
          // check otherOfferingData object
          highSideInstances = offeringGroupObj.otherOfferingData?.filter(
            obj => highSideSysIds.includes(obj.classificationLevel as string)
          );
        }
      }
    }
    const showSecurityReqs = highSideInstances !== undefined && highSideInstances.length > 0;
    this.doSetShowSecurityRequirements(showSecurityReqs);
  }
  @Mutation
  public doSetShowSecurityRequirements(value: boolean): void {
    this.showSecurityRequirements = value;
  }

  @Action({rawError: true})
  public async saveSecurityRequirements(
    securityReqs: SecurityRequirement[],
  ): Promise<void> {
    // pragma: allowlist secret
    const offeringGroupObj = this.DOWObject.find(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    );
    const isCloudSupportService = 
          DescriptionOfWork.cloudSupportServices.includes(this.currentGroupId);
    securityReqs.forEach(
      secReqObj => {
        // pragma: allowlist secret
        const classLevelSysId = secReqObj.type === "SECRET"
          ? ClassificationRequirements.classificationSecretSysId
          : ClassificationRequirements.classificationTopSecretSysId
        
        // const secretReqsObj = securityReqs.find(obj => obj.type === "SECRET");
        // pragma: allowlist secret
        const secretReqs = (secReqObj?.classification_information_type)?.join(",");

        if (offeringGroupObj && isCloudSupportService) {
          // save other offering instances with secret + classification level
          offeringGroupObj.otherOfferingData?.forEach(instance => {
            if (instance.classificationLevel === classLevelSysId) {
              instance.classifiedInformationTypes = secretReqs;
              instance.tsContractorClearanceType = secReqObj.ts_contractor_clearance_type;
              saveOrUpdateOtherServiceOffering(instance, this.currentGroupId.toLocaleLowerCase());
            }
          });
        } else if (offeringGroupObj) {
          // save classification instances with secret + classification level
          const serviceOfferingObj = offeringGroupObj.serviceOfferings.find(
            obj => obj.name === this.currentOfferingName
          );
          if (serviceOfferingObj) {
            const title = serviceOfferingObj.serviceId;
            const serviceOfferingName = serviceOfferingObj.name === "Other"?
              serviceOfferingObj.otherOfferingName || "": serviceOfferingObj.name || "";
            serviceOfferingObj.classificationInstances?.forEach(instance => {
              if (instance.classificationLevelSysId === classLevelSysId) {
                instance.classifiedInformationTypes = secretReqs;
                instance.tsContractorClearanceType = secReqObj.ts_contractor_clearance_type;
                saveOrUpdateClassificationInstance(
                  instance, title, serviceOfferingName);
              }
            });
          }
        }

      }
    )

    
  }

  @Action({rawError: true})
  public async getDOWSecurityRequirements(): Promise<SecurityRequirement[]> {
    const secretObj: SecurityRequirement = {
      type: "SECRET",
      classification_information_type: [],
    };
    const topSecretObj: SecurityRequirement = {
      type: "TOPSECRET",
      classification_information_type: [],
    };

    [secretObj, topSecretObj].forEach(
      (secReqObj) =>{
        const secReqObjSysId = secReqObj.type === "SECRET"
          ? ClassificationRequirements.classificationSecretSysId
          : ClassificationRequirements.classificationTopSecretSysId
        const isCloudSupportService =
            DescriptionOfWork.cloudSupportServices.includes(this.currentGroupId);
    
        const offeringGroupObj = this.DOWObject.find(
          obj => obj.serviceOfferingGroupId === this.currentGroupId
        );
        if (offeringGroupObj && isCloudSupportService) {
          offeringGroupObj.otherOfferingData?.forEach(instance => {
            if (instance.classificationLevel === secReqObjSysId) {
              const secReqSysIds = instance.classifiedInformationTypes
                ? instance.classifiedInformationTypes.split(",")
                : [];
              secReqObj.classification_information_type = secReqSysIds;
              secReqObj.ts_contractor_clearance_type = instance.tsContractorClearanceType;
            }
    
          });
        } else if (offeringGroupObj && !isCloudSupportService) {
          const offering = offeringGroupObj.serviceOfferings.find(
            obj => obj.name === this.currentOfferingName
          );
          if (offering) {
            const secretInstance = offering.classificationInstances?.find(
              obj => obj.classificationLevelSysId === secReqObjSysId
            );
            if (secretInstance) {
              const secReqSysIds = secretInstance.classifiedInformationTypes
                ? secretInstance.classifiedInformationTypes.split(",")
                : [];
              secReqObj.classification_information_type = secReqSysIds;
              secReqObj.ts_contractor_clearance_type = secretInstance.tsContractorClearanceType;
            }
          }
        }
      }
    )
    

    const securityReqs: SecurityRequirement[] = [ secretObj, topSecretObj ];
    return securityReqs;
  }

  public DOWArchitectureNeeds = _.cloneDeep(defaultDOWArchitecturalNeeds);
  travelSummaryInstances: TravelSummaryTableData[] = [];

  @Action({rawError: true})
  public async setTravel(travelInstances: TravelSummaryTableData[]): Promise<void> {
    this.doSetTravel(travelInstances);
  }

  @Mutation
  public doSetTravel(travelInstances: TravelSummaryTableData[]): void {
    this.travelSummaryInstances = travelInstances;
  }

  /**
   * Gets the acquisition package sys id from the acquisition package store and then loads
   * all the travel records for the acquisition.
   */
  @Action({rawError: true})
  public async loadTravel(): Promise<void> {
    const travelRequestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" +
        AcquisitionPackage.acquisitionPackage?.sys_id as string
      }
    };
    const travelList = await api.travelRequirementTable.getQuery(travelRequestConfig);
    await this.doSetTravel(travelList.map((travel, index): TravelSummaryTableData => {
      return {
        sys_id: travel.sys_id,
        acquisition_package: (travel.acquisition_package as ReferenceColumn).value,
        duration_in_days: travel.duration_in_days,
        instanceNumber: index + 1,
        number_of_travelers: travel.number_of_travelers,
        number_of_trips: travel.number_of_trips,
        selected_periods: travel.selected_periods?.split(","),
        trip_location: travel.trip_location
      }
    }));
  }

  /**
   * Compares the travelSummaryInstances of this store with the newTravel passed to this
   * function and marks them for create, update and delete.
   * @param newTravel
   */
  @Action({rawError: true})
  public async saveTravel(
    newTravel: TravelSummaryTableData[]): Promise<boolean> {
    const newTravelDTO: TravelRequirementDTO[] =
        newTravel.map((travel): TravelRequirementDTO  => {
          return {
            sys_id: travel.sys_id,
            acquisition_package: travel.acquisition_package as string,
            duration_in_days: travel.duration_in_days,
            number_of_travelers: travel.number_of_travelers,
            number_of_trips: travel.number_of_trips,
            selected_periods: travel.selected_periods.toString(), // csv
            trip_location: travel.trip_location
          }
        })
    const createList = newTravelDTO.filter(travel => !(travel.sys_id && travel.sys_id.length > 0));
    const updateList = newTravelDTO.filter(travel => (travel.sys_id && travel.sys_id.length > 0));
    const apiCallList: Promise<TravelRequirementDTO | void>[] = [];
    createList.forEach(markedForCreate => {
      apiCallList.push(api.travelRequirementTable
        .create({...markedForCreate,
          acquisition_package: AcquisitionPackage.acquisitionPackage?.sys_id as string
        }));
    })
    updateList.forEach(markedForUpdate => {
      apiCallList.push(api.travelRequirementTable
        .update(markedForUpdate.sys_id as string, markedForUpdate));
    })
    await Promise.all(apiCallList);
    return true;
  }

  /**
   * deletes one travel instance
   * @param sysId sysId of travel instance to be removed
   */
  @Action({rawError: true})
  public async deleteTravelInstance(sysId: string): Promise<void> {
    await api.travelRequirementTable.remove(sysId);
  }

  /**
   * deletes all travel instances associated with acqpackage
   * @param sysIds: string [] - sysId of travel instance to be removed
   */
  @Action({rawError: true})
  public async deleteTravelAll(sysIds: string[]): Promise<void> {
    await this.deleteTravelFromIGCEEstimateTable(sysIds);
    await this.deleteTravelFromRequirementsCostEstimateTable();
  }

  /**
   * deletes all travel instances from IGCE Estimate table
   * @param sysIds: string [] - sysId of travel instance to be removed
   */
  @Action({rawError: true})
  public async deleteTravelFromIGCEEstimateTable(sysIds: string[]): Promise<void> {
    await sysIds.forEach(async (sysId)=>{
      await api.travelRequirementTable.remove(sysId);
    });
  }

  /**
   * deletes travel_options and travel_estimated_values from
   * `DAPPS:Requirements Cost Estimate` table
   */
  @Action({rawError: true})
  public async deleteTravelFromRequirementsCostEstimateTable(): Promise<void> {
    const storeRCE = await IGCEStore.getRequirementsCostEstimate();
    storeRCE.travel.estimated_values = "";
    storeRCE.travel.option = "";

    await api.requirementsCostEstimateTable.update(
        storeRCE.sys_id as string,
        await IGCEStore.transformRequirementsCostEstimateFromTreeToFlat(storeRCE)
    );
  }

  @Action({rawError: true})
  public async setDOWArchitecturalDesign(value: ArchitecturalDesignRequirementDTO): Promise<void> {
    const sysId = await this.saveDOWArchitecturalDesign(value);
    value.sys_id = sysId;
    value.acquisition_package = AcquisitionPackage.packageId;
    this.doSetDOWArchitecturalDesign(value);
  }

  @Mutation
  public doSetDOWArchitecturalDesign(value: ArchitecturalDesignRequirementDTO): void {
    this.DOWArchitectureNeeds = this.DOWArchitectureNeeds
      ? Object.assign(this.DOWArchitectureNeeds, value)
      : value;
  }
  @Action({rawError: true})
  public async loadArchitecturalDesignByPackageId(): Promise<void> {
    const packageId = AcquisitionPackage.packageId
    const requestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + packageId
      }
    };
    const architecturalDesignDetails = await api.architecturalDesignRequirementTable
      .getQuery(requestConfig);
    if (architecturalDesignDetails.length > 0) {
      const sysId = typeof architecturalDesignDetails[0].acquisition_package === "object"
        ? architecturalDesignDetails[0].acquisition_package.value as string
        : architecturalDesignDetails[0].acquisition_package as string;
      const classifications = typeof architecturalDesignDetails[0]
        .data_classification_levels === "string"? architecturalDesignDetails[0]
          .data_classification_levels.split(','):
        architecturalDesignDetails[0].data_classification_levels
      this.doSetDOWArchitecturalDesign({
        ...architecturalDesignDetails[0],
        data_classification_levels: classifications,
        acquisition_package: sysId
      });
    }
  }



  @Action({rawError: true})
  public async saveDOWArchitecturalDesign(
    value: ArchitecturalDesignRequirementDTO): Promise<string> {
    const packageId = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    let sysId = "";
    let classificationLevels = "";
    if(Array.isArray(value.data_classification_levels)){
      classificationLevels = value.data_classification_levels.join(",");
    } else {
      classificationLevels = value.data_classification_levels;
    }

    if(value.sys_id){
      await api.architecturalDesignRequirementTable.update(
        value.sys_id,
        {
          ...value,
          acquisition_package: packageId,
          data_classification_levels: classificationLevels
        }
      );
      sysId = value.sys_id as string;
    } else {
      const savedObject = await api.architecturalDesignRequirementTable.create(
        {
          ...value,
          acquisition_package: packageId,
          data_classification_levels: classificationLevels
        }
      );
      sysId = savedObject.sys_id as string;
    }

    return sysId;
  }

  @Action({rawError: true})
  public async saveTravelRequirements(
    value: ArchitecturalDesignRequirementDTO): Promise<string> {

    const packageId = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    let sysId = "";
    let classificationLevels = "";


    if(Array.isArray(value.data_classification_levels)){
      classificationLevels = value.data_classification_levels.join(",");
    } else {
      classificationLevels = value.data_classification_levels;
    }

    if(value.sys_id){
      await api.architecturalDesignRequirementTable.update(
        value.sys_id,
        {
          ...value,
          acquisition_package: packageId,
          data_classification_levels: classificationLevels
        }
      );
      sysId = value.sys_id as string;
    } else {
      const savedObject = await api.architecturalDesignRequirementTable.create(
        {
          ...value,
          acquisition_package: packageId,
          data_classification_levels: classificationLevels
        }
      );
      sysId = savedObject.sys_id as string;
    }

    return sysId;
  }

  @Action({rawError: true})
  public async getTravel(): Promise<TravelSummaryTableData[]> {
    return this.travelSummaryInstances;
  }

  @Action({rawError: true})
  public async getDOWArchitecturalNeeds(): Promise<ArchitecturalDesignRequirementDTO> {
    return this.DOWArchitectureNeeds;
  }

  @Action({rawError: true})
  public async loadDOWfromAcquistionPackageId(sysId: string): Promise<void> {
    const requestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + sysId + "^ORDERBYinstance_number",
        sysparm_display_value: "false"
      }
    };
    this.setCurrentOfferingGroupId("COMPUTE");
    const computeItems = await api.computeEnvironmentInstanceTable.getQuery(requestConfig);
    if(computeItems.length > 0)
      this.addOfferingGroup("COMPUTE");
    computeItems.forEach((item,index) => {
      const offeringData = mapOtherOfferingFromDTO(
        index + 1,
          item as ComputeEnvironmentInstanceDTO
      );
      this.doSetOtherOfferingData(offeringData);
    });

    this.setCurrentOfferingGroupId("DATABASE");
    const databaseItems = await api.databaseEnvironmentInstanceTable.getQuery(requestConfig);
    if(databaseItems.length > 0)
      this.addOfferingGroup("DATABASE");
    databaseItems.forEach((item,index) => {
      const offeringData = mapOtherOfferingFromDTO(
        index + 1,
          item as DatabaseEnvironmentInstanceDTO
      );
      this.doSetOtherOfferingData(offeringData);
    });

    this.setCurrentOfferingGroupId("STORAGE");
    const storageItems = await api.storageEnvironmentInstanceTable.getQuery(requestConfig);
    if(storageItems.length > 0)
      this.addOfferingGroup("STORAGE");
    storageItems.forEach((item,index) => {
      const offeringData = mapOtherOfferingFromDTO(
        index + 1,
          item as StorageEnvironmentInstanceDTO
      );
      this.doSetOtherOfferingData(offeringData);
    });

    this.setCurrentOfferingGroupId("GENERAL_XAAS");
    const xaasItems = await api.xaaSEnvironmentInstanceTable.getQuery(requestConfig);
    if(xaasItems.length > 0)
      this.addOfferingGroup("GENERAL_XAAS");
    xaasItems.forEach((item,index) => {
      const offeringData = mapOtherOfferingFromDTO(
        index + 1,
          item as XaasEnvironmentInstanceDTO
      );
      this.doSetOtherOfferingData(offeringData);
    });

    const supportItems = await api.cloudSupportEnvironmentInstanceTable.getQuery(requestConfig);
    [
      "advisory_assistance",
      "help_desk_services",
      "documentation_support",
      "general_cloud_support",
      "training",
      "portability_plan"
    ].forEach(groupId => {
      const tempItems = supportItems.filter(item => item.service_type === groupId.toUpperCase());

      if(tempItems.length > 0){
        this.addOfferingGroup(groupId.toUpperCase());
        this.setCurrentOfferingGroupId(groupId.toUpperCase());
      }

      tempItems.forEach((item,index) => {
        const offeringData = mapOtherOfferingFromDTO(
          index + 1,
            item as CloudSupportEnvironmentInstanceDTO
        );
        this.doSetOtherOfferingData(offeringData);
      });
    });

    const selectedOfferingsList = await api.selectedServiceOfferingTable.getQuery(requestConfig);
    const serviceOfferingList = [
      "developer_tools",
      "applications",
      "machine_learning",
      "networking",
      "security",
      "edge_computing",
      "iot"
    ];
    for(const groupId of serviceOfferingList){
      const offeringsForGroup: ServiceOfferingDTO[] = this.serviceOfferings.filter(
        item => item.service_offering_group === groupId.toUpperCase()
      );
      for(const group of offeringsForGroup){
        const tempOfferingsList = selectedOfferingsList.filter(
          item => (item.service_offering as ReferenceColumn).value === group.sys_id
        );

        for(const offering of tempOfferingsList){
          const groupIndex = this.DOWObject.findIndex(
            item => item.serviceOfferingGroupId === group.service_offering_group);

          if(groupIndex < 0)
            this.addOfferingGroup(group.service_offering_group);

          if(tempOfferingsList.length > 0){
            this.setCurrentOfferingGroupId(group.service_offering_group);
          }

          const classificationInstances: DOWClassificationInstance[] = [];
          const classificationInstanceIds = offering.classification_instances !== ""
            ? offering.classification_instances.split(",") : [];
          if(classificationInstanceIds.length > 0) {
            let queryString = "sys_id=";
            if(classificationInstanceIds.length > 1)
              queryString += classificationInstanceIds.join("^ORsys_id=");
            else
              queryString += classificationInstanceIds[0];
            const ciRequestConfig: AxiosRequestConfig = {
              params: {
                sysparm_query: queryString,
                sysparm_display_value: "false"
              }
            };

            const dtoObjects = await api.classificationInstanceTable.getQuery(ciRequestConfig);

            for(const dtoItem of dtoObjects){
              const tempItem = mapClassificationInstanceFromDTO(dtoItem);
              classificationInstances.push(tempItem);
            }
          }

          this.DOWObject[this.DOWObject.length - 1].serviceOfferings.push({
            acquisitionPackageSysId: AcquisitionPackage.packageId,
            sys_id: offering.sys_id as string,
            name: group.name as string,
            otherOfferingName: offering.other_service_offering as string,
            description: group.description,
            sequence: group.sequence as string,
            serviceId: group.service_offering_group as string,
            classificationInstances: classificationInstances
          });
        }
      }
    }

    this.setCurrentOfferingGroupId("");
    await this.checkServiceOfferingTypesSelected();
  }

  // store session properties
  protected sessionProperties: string[] = [
    nameofProperty(this, (x) => x.serviceOfferings),
    nameofProperty(this, (x) => x.serviceOfferingGroups),
    nameofProperty(this, (x)=> x.userSelectedServiceOfferings),
    nameofProperty(this, (x)=> x.DOWObject)
  ];

  @Action
  public async getServiceGroupVerbiageInfo(): Promise<Record<string, string>> {
    return serviceGroupVerbiageInfo[this.currentGroupId];
  }

  @Action
  public async getServiceGroupVerbiageInfoWithGroupId(groupId: string): 
    Promise<Record<string, string>> {
    return serviceGroupVerbiageInfo[groupId];
  }


  @Action
  public async getDOWObject(): Promise<DOWServiceOfferingGroup[]> {
    return this.DOWObject;
  }

  // getters
  public get currentOfferingGroupIndex(): number {
    return this.DOWObject
      .findIndex(group=>group.serviceOfferingGroupId === this.currentGroupId);
  }

  public get currentOfferingIndex(): number {
    const groupIndex = this.currentOfferingGroupIndex;
    const offeringIndex = groupIndex > -1 ? this.DOWObject[groupIndex]
      .serviceOfferings.findIndex(offering=> offering.name
            === this.currentOfferingName): groupIndex;
    return offeringIndex;
  }

  public get serviceOfferingsForGroup(): DOWServiceOffering[] {
    const groupIndex = this.currentOfferingGroupIndex;
    return groupIndex > -1 ? this.DOWObject[groupIndex].serviceOfferings : [];
  }

  public get validServiceGroups(): DOWServiceOfferingGroup[] {
    const sectionOfferingGroups = this.currentDOWSection === "XaaS"
      ? this.xaasServices : this.cloudSupportServices;

    return this.DOWObject.filter(
      obj => obj.serviceOfferingGroupId.indexOf("NONE") === -1
            && sectionOfferingGroups.includes(obj.serviceOfferingGroupId)
    );
  }

  public get isEndOfServiceOfferings(): boolean {
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOfferingName);
    return (currentOfferingIndex + 1) === offerings.length;
  }

  public get isEndOfServiceGroups(): boolean {
    const groupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return (groupIndex + 1) === this.validServiceGroups.length;
  }

  public get isAtBeginningOfServiceOfferings(): boolean {
    const offerings =  this.serviceOfferingsForGroup;
    const currentOfferingIndex = offerings
      .findIndex(offering=> offering.name === this.currentOfferingName);
    return currentOfferingIndex == 0;
  }

  public get isAtBeginningOfServiceGroups(): boolean {
    const groupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);
    return groupIndex === 0;

  }

  public get nextServiceOffering(): { name: string, sysId: string} | undefined {

    const serviceOfferings = this.serviceOfferingsForGroup;

    if(!serviceOfferings.length)
    {
      return undefined;
    }

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOfferingName);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOfferingName}`);
    }

    if((currentServiceIndex + 2) <= serviceOfferings.length )
    {
      const nextOffering = serviceOfferings[currentServiceIndex + 1];
      return { name: nextOffering.name, sysId: nextOffering.sys_id }
    }

    return undefined;
  }

  public get previousServiceOffering(): { name: string, sysId: string } | undefined {

    const serviceOfferings = this.serviceOfferingsForGroup;

    if(!serviceOfferings.length)
    {
      return undefined;
    }

    const currentServiceIndex = serviceOfferings
      .findIndex(offering=>offering.name === this.currentOfferingName);

    if(currentServiceIndex < 0)
    {
      throw new Error(`unable to get index for current offer ${this.currentOfferingName}`);
    }

    if(currentServiceIndex > -1 )
    {
      const serviceIndex = currentServiceIndex > 0 ? currentServiceIndex - 1: currentServiceIndex;
      const nextOffering = serviceOfferings[serviceIndex];
      return { name: nextOffering.name, sysId: nextOffering.sys_id }
    }

    return undefined;
  }

  public get nextOfferingGroup(): string | undefined {
    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }

    if((currentGroupIndex + 2) <= this.validServiceGroups.length){
      const nextGroup = this.validServiceGroups[currentGroupIndex + 1].serviceOfferingGroupId;
      return nextGroup;
    }

    return undefined;
  }

  public get lastOfferingGroup(): string | undefined {
    const len = this.validServiceGroups.length;
    return len ? this.validServiceGroups[len - 1].serviceOfferingGroupId : undefined;
  }

  public get prevOfferingGroup(): string | undefined {

    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }

    const groupIndex = currentGroupIndex > 0 ? currentGroupIndex - 1 :  currentGroupIndex;
    const nextGroup = this.validServiceGroups[groupIndex].serviceOfferingGroupId;
    return nextGroup;
  }

  public get lastOfferingForGroup(): { name: string, sysId: string } | undefined {

    const currentGroupIndex = this.validServiceGroups
      .findIndex(group=> group.serviceOfferingGroupId === this.currentGroupId);

    if(currentGroupIndex < 0){
      return undefined;
    }

    const lastOffering =  last(this.validServiceGroups[currentGroupIndex].serviceOfferings);

    return lastOffering
      ? { name: lastOffering.name, sysId: lastOffering.sys_id }
      : undefined;
  }

  public get canGetPreviousServiceOffering(): boolean {
    const currentOfferingIndex = this.currentOfferingIndex;
    return currentOfferingIndex >=0;
  }

  public get missingClassificationLevels(): boolean {
    return ClassificationRequirements.selectedClassificationLevels.length === 0;;
  }

  public get selectedServiceOfferingGroups(): string[] {
    return this.DOWObject.map(group=> group.serviceOfferingGroupId);
  }

  public get selectedServiceOfferings(): string[] {
    const currentGroup = this.DOWObject.find(group =>
      group.serviceOfferingGroupId === this.currentGroupId);
    if (currentGroup?.serviceOfferings) {
      return currentGroup.serviceOfferings.flatMap(offering => offering.name);
    }
    return [""];
  }

  public get currentOfferingGroupHasOfferings(): boolean {
    return this.serviceOfferingsForGroup.length > 0;
  }

  @Mutation
  public async checkServiceOfferingTypesSelected(): Promise<void> {
    const selectedCategoryIds = this.DOWObject.map(obj => obj.serviceOfferingGroupId);
    if (this.DOWObject.length && selectedCategoryIds.length) {
      const selectedXaaS = this.xaasServices.filter(
        cat => selectedCategoryIds.includes(cat)
      );
      this.hasXaasService = selectedXaaS.length > 0;
      const selectedCloud = this.cloudSupportServices.filter(
        cat => selectedCategoryIds.includes(cat)
      );
      this.hasCloudService = selectedCloud.length > 0;
    } else {
      this.hasXaasService = false;
      this.hasCloudService = false;
    }
  }

  public summaryBackToContractDetails = false;

  @Mutation
  public setBackToContractDetails(bool: boolean): void {
    this.summaryBackToContractDetails = bool;
  }

  @Mutation
  public setIsIncomplete(bool: boolean): void {
    this.isIncomplete = bool;
  }

  @Mutation
  private setInitialized(value: boolean) {
    this.initialized = value;
  }

  @Mutation
  private setServiceOfferings(value: ServiceOfferingDTO[]) {
    this.serviceOfferings = value;
  }

  @Mutation
  public setServiceOfferingGroups(value: SystemChoiceDTO[]): void {
    value.forEach((value, index) => {
      // ensure "none apply" options are last in sequence
      value.sequence = value.value.indexOf("NONE") > -1 ? 99 : index + 1;
    });
    this.serviceOfferingGroups = value;
  }

  public currentGroupRemoved = false;
  public currentGroupRemovedForNav = false;
  public lastGroupRemoved = false;

  @Mutation
  public setCurrentGroupRemoved(bool: boolean): void {
    this.currentGroupRemoved = bool;
  }

  @Mutation
  public setCurrentGroupRemovedForNav(bool: boolean): void {
    this.currentGroupRemovedForNav = bool;
  }

  @Mutation
  public setLastGroupRemoved(bool: boolean): void {
    this.lastGroupRemoved = bool;
  }

  @Action({rawError: true})
  public async serviceOfferingHasInstances(offeringName: string): Promise<boolean> {
    let hasInstances = false;
    const currentOfferingGroup = this.DOWObject.find(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    )
    if (currentOfferingGroup
        && currentOfferingGroup.serviceOfferings
        && currentOfferingGroup.serviceOfferings.length > 0
    ) {
      const serviceOfferingObj = currentOfferingGroup.serviceOfferings.find(
        obj => obj.name === offeringName
      );
      if (serviceOfferingObj
          && serviceOfferingObj.classificationInstances
          && serviceOfferingObj.classificationInstances.length > 0
      ) {
        hasInstances = true;
      }
    }
    return hasInstances;
  }

  @Action({rawError: true})
  public async removeServiceOffering(offeringName: string): Promise<void> {
    const offeringGroupIndex = this.DOWObject.findIndex(
      group => group.serviceOfferingGroupId === this.currentGroupId
    );

    const offeringGroupObj = this.DOWObject.find(
      group => group.serviceOfferingGroupId === this.currentGroupId
    );

    if (offeringGroupObj) {
      const offeringObj = offeringGroupObj.serviceOfferings.find(
        offering => offering.name === offeringName
      );

      if (offeringObj
          && offeringObj?.classificationInstances
          && offeringObj.classificationInstances.length > 0
      ) {
        const sysIds: string[] = [];
        offeringObj.classificationInstances.forEach(instance => {
          sysIds.push(instance.sysId as string);
        });
        await this.removeClassificationInstances(sysIds);
        await this.deleteServiceOfferingFromSNOW(offeringObj.sys_id);
      }
      const updatedOfferings =
          offeringGroupObj.serviceOfferings.filter(obj => obj.name !== offeringName);
      this.DOWObject[offeringGroupIndex].serviceOfferings = updatedOfferings;
    }
    this.checkServiceOfferingTypesSelected();
  }

  @Action({rawError: true})
  public async deleteServiceOfferingFromSNOW(sysId: string): Promise<void> {
    await api.selectedServiceOfferingTable.remove(sysId);
  }

  @Action({rawError: true})
  public async removeCurrentOfferingGroup(): Promise<void> {
    if (this.otherServiceOfferings.includes(this.currentGroupId)
        || this.cloudSupportServices.includes(this.currentGroupId)
    ) {
      await this.deleteOtherOffering();
    } else {
      await this.deleteOfferingGroupInstances();
      await this.setSelectedOfferings({selectedOfferingSysIds: [], otherValue: ""});
      await this.doRemoveCurrentOfferingGroup();
    }
    this.checkServiceOfferingTypesSelected();
  }

  @Action({rawError: true})
  public async deleteOfferingGroupInstances(): Promise<void> {
    if (!this.currentGroupRemoved) {
      const groupIdToRemove = this.currentGroupId;
      const groupToRemoveObj = this.DOWObject.find(
        e => e.serviceOfferingGroupId === groupIdToRemove
      );
      if (groupToRemoveObj
          && groupToRemoveObj.serviceOfferings
          && groupToRemoveObj.serviceOfferings.length > 0
      ) {
        groupToRemoveObj.serviceOfferings.forEach(async offering => {
          const sysIds: string[] = [];
          if (offering.classificationInstances && offering.classificationInstances.length > 0) {
            offering.classificationInstances.forEach(instance => {
              sysIds.push(instance.sysId as string);
            });
          }
          await this.removeClassificationInstances(sysIds);
          await this.deleteServiceOfferingFromSNOW(offering.sys_id)
        })
      }
    }
  }

  // removes current offering group if user clicks  the "I don't need these cloud resources"
  // button or does not select any offerings and clicks "Continue" button
  @Mutation
  public async doRemoveCurrentOfferingGroup(): Promise<void> {
    if (!this.currentGroupRemoved) {
      this.currentGroupRemovedForNav = true;
      const groupIdToRemove = this.currentGroupId;
      const currentDOWSectionGroups = this.currentDOWSection === "XaaS"
        ? this.xaasServices : this.cloudSupportServices;

      const selectedGroupsInDOWSectionBefore = this.DOWObject.filter(
        obj => currentDOWSectionGroups.includes(obj.serviceOfferingGroupId)
      );

      // remove group from DOWObject
      this.DOWObject = this.DOWObject.filter(
        obj => obj.serviceOfferingGroupId !== groupIdToRemove
      );

      const selectedGroupsInDOWSectionAfter = this.DOWObject.filter(
        obj => currentDOWSectionGroups.includes(obj.serviceOfferingGroupId)
      );

      if (selectedGroupsInDOWSectionAfter.length === 0) {
        this.lastGroupRemoved = true;
        this.currentGroupId = "";
      } else {
        this.lastGroupRemoved = false;
        const indexBefore = selectedGroupsInDOWSectionBefore.findIndex(
          obj => obj.serviceOfferingGroupId === groupIdToRemove
        );
        const i = indexBefore === selectedGroupsInDOWSectionBefore.length - 1
          ? indexBefore - 1 : indexBefore
        this.currentGroupId = selectedGroupsInDOWSectionAfter[i].serviceOfferingGroupId;
      }

      this.currentGroupRemoved = true;
    }
  }

  @Action
  public async getReturnToDOWSummary(): Promise<boolean> {
    return this.returnToDOWSummary;
  }
  @Mutation
  public setReturnToDOWSummary(bool: boolean): void {
    this.returnToDOWSummary = bool;
  }

  public get getFromAnticipatedUsersAndData(): boolean {
    return this.fromAnticipatedUsersAndData;
  }

  @Mutation
  public setFromAnticipatedUsersAndData(bool: boolean): void {
    this.fromAnticipatedUsersAndData = bool;
  }

  @Mutation
  public setReviewGroupFromSummary(bool: boolean): void {
    this.reviewGroupFromSummary = bool;
  }

  @Mutation
  public setAddGroupFromSummary(bool: boolean): void {
    this.addGroupFromSummary = bool;
  }

  @Mutation
  public addOfferingGroup(groupId: string): void {
    const doesGroupAlreadyExistingInDOWObj = this.DOWObject.some(
      dow => dow.serviceOfferingGroupId === groupId
    );
    // if group does NOT exist in DOW object, add it
    if (!doesGroupAlreadyExistingInDOWObj){
      const group = this.serviceOfferingGroups.find(e => e.value === groupId)
      const offeringGroup: DOWServiceOfferingGroup = {
        serviceOfferingGroupId: groupId,
        sequence: group?.sequence || 99,
        serviceOfferings: []
      }
      this.DOWObject.push(offeringGroup);
    }
  }

  @Action
  public async setSelectedOfferingGroups(selectedOfferingGroupIds: string[]): Promise<void> {
    await this.doSetSelectedOfferingGroups(selectedOfferingGroupIds);
    this.checkServiceOfferingTypesSelected()
  }

  @Mutation
  public async doSetSelectedOfferingGroups(selectedOfferingGroupIds: string[]): Promise<void> {
    const inXaaS = this.currentDOWSection === "XaaS";
    const inCloud = this.currentDOWSection === "CloudSupport";
    if (selectedOfferingGroupIds.length) {
      selectedOfferingGroupIds.forEach(async (selectedOfferingGroupId) => {
        if (!this.DOWObject.some(e => e.serviceOfferingGroupId === selectedOfferingGroupId)) {
          const groupIndex = this.DOWObject.findIndex((obj) => {
            return obj.serviceOfferingGroupId === selectedOfferingGroupId
          });
          if (groupIndex === -1) {
            const group = this.serviceOfferingGroups.find(e => e.value === selectedOfferingGroupId)
            const offeringGroup: DOWServiceOfferingGroup = {
              serviceOfferingGroupId: selectedOfferingGroupId,
              sequence: group?.sequence || 99,
              serviceOfferings: []
            }
            this.DOWObject.push(offeringGroup);
          }
        }
        // remove any groups that were previously checked and now unchecked
        this.DOWObject.forEach((offeringGroup, index) => {
          const groupId = offeringGroup.serviceOfferingGroupId;
          const groupInThisSection = inXaaS && this.xaasServices.includes(groupId)
              || inCloud && this.cloudSupportServices.includes(groupId);
          if (groupInThisSection && !selectedOfferingGroupIds.includes(groupId)) {
            this.DOWObject.splice(index, 1);
          }
        });
        this.DOWObject.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
      });

    }
    const sectionServices = inXaaS ? this.xaasServices : this.cloudSupportServices;
    const selectedSectionServices = selectedOfferingGroupIds.filter(
      val => sectionServices.includes(val)
    );

    this.currentGroupId = selectedSectionServices.length > 0
    && selectedSectionServices[0].indexOf("NONE") === -1
      ? selectedSectionServices[0]
      : "";
    this.currentOfferingName = "";
    this.currentOfferingSysId = "";
    this.XaaSNoneSelected = selectedOfferingGroupIds.includes(this.xaaSNoneValue);
    this.cloudNoneSelected = selectedOfferingGroupIds.includes(this.cloudNoneValue);
  }

  @Action
  public async setSelectedOfferings(
    { selectedOfferingSysIds, otherValue }: { selectedOfferingSysIds: string[], otherValue: string }
  ): Promise<void> {
    this.doSetSelectedServiceOffering({ selectedOfferingSysIds, otherValue });
    this.checkServiceOfferingTypesSelected();
  }

  @Action
  public async saveSelectedServiceOfferings(
  ): Promise<void> {
    const groupIndex
        = this.DOWObject.findIndex((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    if (groupIndex >= 0) {
      const currentOfferings = this.DOWObject[groupIndex].serviceOfferings;
      for(const offering of currentOfferings){
        const serviceOffering = this.serviceOfferings.find(item => item.name === offering.name
            && item.service_offering_group === offering.serviceId);
        if(serviceOffering){
          const sysId = await saveOrUpdateSelectedServiceOffering(
            offering, serviceOffering.sys_id as string);
          offering.sys_id = sysId;
        }
      }
    }
  }

  @Mutation
  public doSetSelectedServiceOffering(
    { selectedOfferingSysIds, otherValue }: { selectedOfferingSysIds: string[], otherValue: string }
  ): void {
    const acquisitionPackageId = AcquisitionPackage.packageId;
    const groupIndex
        = this.DOWObject.findIndex((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    if (groupIndex >= 0) {
      let currentOfferings = this.DOWObject[groupIndex].serviceOfferings;
      if (selectedOfferingSysIds.length === 0) {
        this.DOWObject[groupIndex].serviceOfferings = [];
        currentOfferings = [];
      } else {
        selectedOfferingSysIds.forEach((selectedOfferingSysId) => {
          const foundOffering
              = this.serviceOfferings.find((e) => e.sys_id === selectedOfferingSysId);

          if (foundOffering && !currentOfferings.some((e) => e.name === foundOffering?.name)) {
            // check to see if the offering is other and add otheroffering name
            const offering = {
              name: foundOffering.name,
              acquisitionPackageSysId: acquisitionPackageId,
              otherOfferingName: "",
              sys_id: "",
              classificationInstances: [],
              sequence: foundOffering.sequence,
              serviceId: foundOffering.service_offering_group
            }
            if(foundOffering.name === "Other" && otherValue){
              offering.otherOfferingName = otherValue
              currentOfferings.push(offering)
            }
            if(foundOffering.name !== "Other"){
              currentOfferings.push(offering);
            }
          }
        });

        this.DOWObject[groupIndex].serviceOfferings.sort(
          (a, b) => parseInt(a.sequence) > parseInt(b.sequence) ? 1 : -1
        );
      }
      const otherIndex = currentOfferings.findIndex(obj => obj.name === "Other");
      if(otherIndex >= 0 && otherValue){
        currentOfferings[otherIndex].otherOfferingName = otherValue
      }
      if(otherIndex >=0 && !otherValue){
        currentOfferings.splice(otherIndex,1)
      }
      this.currentOfferingName = currentOfferings.length > 0
        ? currentOfferings[0].name : "";
      this.currentOfferingSysId = currentOfferings.length > 0
        ? currentOfferings[0].sys_id : "";
    }
  }

  @Action({ rawError: true })
  public async setOfferingDetails(instancesData: DOWClassificationInstance[]): Promise<void> {
    const updatedInstancesData: DOWClassificationInstance[] = [];

    const groupIndex = this.DOWObject.findIndex(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    );
    const offeringIndex = this.DOWObject[groupIndex].serviceOfferings.findIndex(
      // TODO: use sys_id instead of .name - this.currentOfferingSysId not currently being set
      // obj => obj.sys_id === this.currentOfferingSysId
      obj => obj.name === this.currentOfferingName
    );

    const selectedServiceOffering = this.DOWObject[groupIndex].serviceOfferings[offeringIndex];

    const name = selectedServiceOffering.name === "Other"?
      selectedServiceOffering.otherOfferingName || "": selectedServiceOffering.name || "";
    for(const instanceData of instancesData){
      const dataSysId = await saveOrUpdateClassificationInstance(
        instanceData,
        selectedServiceOffering.serviceId,
        name);
      instanceData.sysId = dataSysId as string;
      updatedInstancesData.push(instanceData);
    }

    const currentInstances = _.cloneDeep(
      selectedServiceOffering.classificationInstances
    )
    if (currentInstances && currentInstances.length) {
      const currentSysIds = currentInstances.map(obj => obj.sysId);
      const updatedDataSysIds = instancesData.map(obj => obj.sysId);
      const instancesToDelete = currentSysIds.filter(sysId => !updatedDataSysIds.includes(sysId));
      if (instancesToDelete && instancesToDelete.length) {
        const sysIds: string[] = [];
        instancesToDelete.forEach(sysId => sysId !== undefined ? sysIds.push(sysId) : false);
        await this.removeClassificationInstances(sysIds)
      }
    }

    this.DOWObject[groupIndex].serviceOfferings[offeringIndex].classificationInstances
        = updatedInstancesData;

    await this.saveSelectedServiceOfferings().then(async () => {
      await this.setNeedsSecurityRequirements();
    });
  }

  // ******************************************************************
  // ******************************************************************
  // BEGIN OtherServiceOfferings - COMPUTE/GENERAL_XAAS/DATABSE - data/methods
  // ******************************************************************
  // ******************************************************************

  currentOtherServiceInstanceNumber = 0;

  emptyOtherOfferingInstance: OtherServiceOfferingData = {
    acquisitionPackageSysId: "",
    instanceNumber: this.currentOtherServiceInstanceNumber,
    environmentType: "",
    classificationLevel: "",
    deployedRegions: [],
    deployedRegionsOther: "",
    descriptionOfNeed: "",
    entireDuration: "",
    periodsNeeded: [],
    operatingSystemAndLicensing: "",
    numberOfVCPUs: "",
    memoryAmount: "",
    memoryUnit: "GB",
    storageType: "",
    storageAmount: "",
    storageUnit: "GB",
    performanceTier: "",
    performanceTierOther: "",
    numberOfInstances: "1",
    requirementTitle: "",
    usageDescription: "",
    operatingEnvironment: "",
    databaseType: "",
    databaseTypeOther: "",
    licensing: "",
    operatingSystem: "",
    region: "",
    processorSpeed: "",
    networkPerformance: "",
    databaseLicensing: "",
    sysId: "",
    personnelOnsiteAccess: "",
    tsContractorClearanceType: "",
    trainingType: "",
    trainingLocation: "",
    trainingTimeZone: "",
    trainingPersonnel: "",
    classifiedInformationTypes: "",
  }

  otherOfferingInstancesTouched: Record<string, number[]> = {};

  @Action
  public async getLastOtherOfferingInstanceNumber(): Promise<number> {
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === this.currentGroupId.toLowerCase()
    );
    if (offeringIndex > -1) {
      const otherOfferingData = this.DOWObject[offeringIndex].otherOfferingData;
      if (otherOfferingData && otherOfferingData.length > 0) {
        const instanceNumbers = otherOfferingData.map(obj => obj.instanceNumber);
        return  Math.max(...instanceNumbers);
      }
    }
    return 1;
  }

  @Action
  public async setCurrentOtherOfferingInstanceNumber(number: number): Promise<void> {
    this.doSetCurrentOtherOfferingInstanceNumber(number);
  }

  @Mutation
  public async doSetCurrentOtherOfferingInstanceNumber(number: number): Promise<void> {
    this.currentOtherServiceInstanceNumber = number;
  }

  @Action
  public async getOtherOfferingInstance(instanceNumber: number): Promise<OtherServiceOfferingData> {
    const otherOfferingData = this.otherOfferingObject.otherOfferingData;
    if (otherOfferingData && otherOfferingData.length) {
      const instance = otherOfferingData.find(
        obj => obj.instanceNumber === instanceNumber
      );
      return instance || _.clone(this.emptyOtherOfferingInstance);
    }
    return _.clone(this.emptyOtherOfferingInstance);
  }

  public get otherOfferingObject(): DOWServiceOfferingGroup {
    const currentOfferingId = this.currentGroupId.toLowerCase();
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === currentOfferingId
    );
    return offeringIndex > -1
      ? this.DOWObject[offeringIndex]
      : { serviceOfferingGroupId: "", sequence: 0, serviceOfferings: [] };
  }

  @Action
  public async pushTouchedOtherOfferingInstance(instanceNumber: number): Promise<void> {
    this.doPushTouchedOtherOfferingInstance(instanceNumber);
  }

  @Mutation
  public doPushTouchedOtherOfferingInstance(instanceNumber: number): void {
    const groupKey: string = this.currentGroupId.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(this.otherOfferingInstancesTouched, groupKey)) {
      this.otherOfferingInstancesTouched[groupKey] = [];
    }
    this.otherOfferingInstancesTouched[groupKey].push(instanceNumber);
  }

  @Action
  public async setOtherOfferingData(otherOfferingData: OtherServiceOfferingData): Promise<void> {
    const groupId: string = this.currentGroupId.toLowerCase();
    otherOfferingData.acquisitionPackageSysId = AcquisitionPackage.packageId;
    const objSysId = await saveOrUpdateOtherServiceOffering(otherOfferingData, groupId);
    otherOfferingData.sysId = objSysId;
    this.doSetOtherOfferingData(otherOfferingData);
  }

  @Mutation
  public doSetOtherOfferingData(
    otherOfferingData: OtherServiceOfferingData
  ): void {
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === this.currentGroupId.toLowerCase()
    );
    if (offeringIndex > -1) {
      const otherOfferingObj = this.DOWObject[offeringIndex];
      if (
        otherOfferingObj
          && Object.prototype.hasOwnProperty.call(otherOfferingObj, "serviceOfferingGroupId")
          && otherOfferingObj.serviceOfferingGroupId
      ) {
        const groupId: string = this.currentGroupId.toLowerCase();
        if(groupId === 'portability_plan'){
          if (!Object.prototype.hasOwnProperty.call(otherOfferingObj, "otherOfferingData")) {
            otherOfferingObj.otherOfferingData = [];
            otherOfferingObj.otherOfferingData?.push(otherOfferingData);
          } else {
            const classificationLevel = otherOfferingData.classificationLevel
            const existingInstance = otherOfferingObj.otherOfferingData?.find(
              o => o.classificationLevel === classificationLevel
            );
            if (existingInstance ) {
              Object.assign(existingInstance, otherOfferingData);
            } else {
              otherOfferingObj.otherOfferingData?.push(otherOfferingData);
            }
          }

          if (!Object.prototype.hasOwnProperty.call(this.otherOfferingInstancesTouched, groupId)) {
            this.otherOfferingInstancesTouched[groupId] = [];
          }

          if (this.otherOfferingInstancesTouched[groupId]
            .indexOf(otherOfferingData.instanceNumber) === -1) {
            this.otherOfferingInstancesTouched[groupId].push(otherOfferingData.instanceNumber);
          }

        }else{
          if (!Object.prototype.hasOwnProperty.call(otherOfferingObj, "otherOfferingData")) {
            otherOfferingObj.otherOfferingData = [];
            otherOfferingObj.otherOfferingData?.push(otherOfferingData);
          } else {
            const instanceNumber = otherOfferingData.instanceNumber;
            const existingInstance = otherOfferingObj.otherOfferingData?.find(
              o => o.instanceNumber === instanceNumber
            );
            if (existingInstance ) {
              Object.assign(existingInstance, otherOfferingData);
            } else {
              otherOfferingObj.otherOfferingData?.push(otherOfferingData);
            }
          }

          if (!Object.prototype.hasOwnProperty.call(this.otherOfferingInstancesTouched, groupId)) {
            this.otherOfferingInstancesTouched[groupId] = [];
          }

          if (this.otherOfferingInstancesTouched[groupId]
            .indexOf(otherOfferingData.instanceNumber) === -1) {
            this.otherOfferingInstancesTouched[groupId].push(otherOfferingData.instanceNumber);
          }

        }
       
      } else {
        throw new Error(`Error saving ${this.currentGroupId} data to store`);
      }
    }
  }

  @Action public async getTouchedOtherOfferingInstances(): Promise<number[]> {
    return this.otherOfferingInstancesTouched[this.currentGroupId.toLowerCase()];
  }

  @Action public async hasInstanceBeenTouched(instanceNo: number): Promise<boolean> {
    const groupId = this.currentGroupId.toLowerCase();
    if (!Object.prototype.hasOwnProperty.call(this.otherOfferingInstancesTouched, groupId)) {
      this.otherOfferingInstancesTouched[groupId] = [];
    }

    return this.otherOfferingInstancesTouched[groupId].indexOf(instanceNo) > -1;
  }

  @Action
  public async getOtherOfferingInstances(): Promise<OtherServiceOfferingData[]> {
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === this.currentGroupId.toLowerCase()
    );
    if (offeringIndex > -1) {
      const otherOfferingObj = this.DOWObject[offeringIndex];
      if (
        Object.prototype.hasOwnProperty.call(otherOfferingObj, "otherOfferingData")
          && otherOfferingObj.otherOfferingData
          && otherOfferingObj.otherOfferingData.length > 0
      ) {
        return otherOfferingObj.otherOfferingData;
      }
    }
    return [];
  }


  @Action({rawError: true})
  public async deleteOtherOfferingInstance(instanceNumber: number): Promise<void> {
    this.doDeleteOtherOfferingInstance(instanceNumber);
    this.checkServiceOfferingTypesSelected();
  }

  @Mutation
  public doDeleteOtherOfferingInstance(instanceNumber: number): void {
    const otherOfferingId = this.currentGroupId.toLowerCase();
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === otherOfferingId
    );
    if (offeringIndex > -1) {
      const otherOfferingObj = this.DOWObject[offeringIndex];
      if (
        otherOfferingObj
          && Object.prototype.hasOwnProperty.call(otherOfferingObj, "otherOfferingData")
          && otherOfferingObj.otherOfferingData
      ) {
        const instanceToDelete = otherOfferingObj.otherOfferingData.find(
          obj => obj.instanceNumber === instanceNumber
        );
        if (instanceToDelete && instanceToDelete.sysId) {
          const sysId = instanceToDelete.sysId as string;
          deleteOtherOfferingInstanceFromIGCECostEstimate(
            sysId, otherOfferingObj.serviceOfferingGroupId
          );

          setTimeout(()=>
            deleteOtherOfferingInstanceFromSNOW(sysId , this.currentGroupId), 0
          )
        }

        const instanceIndex = otherOfferingObj.otherOfferingData.findIndex(
          obj => obj.instanceNumber === instanceNumber
        );
        otherOfferingObj.otherOfferingData.splice(instanceIndex, 1);
        for (let i = instanceIndex; i < otherOfferingObj.otherOfferingData.length; i++) {
          otherOfferingObj.otherOfferingData[i].instanceNumber
              = otherOfferingObj.otherOfferingData[i].instanceNumber - 1;
        }

        /**
         * if manually deleting the last instance, remove the otherOfferingObj
         * from the DOW object
         */
        if(otherOfferingObj.otherOfferingData.length===0){
          this.DOWObject.splice(offeringIndex,1);
        }

      }
    }
    // remove instanceNumber from touched ones - this.otherOfferingInstancesTouched
    // decrease each instance number after instanceNumber
    const touchedInstances = this.otherOfferingInstancesTouched[otherOfferingId];
    touchedInstances.sort((a, b) => a > b ? 1 : -1);
    const deleteIndex = touchedInstances.indexOf(instanceNumber);
    touchedInstances.splice(deleteIndex, 1);
    this.otherOfferingInstancesTouched[otherOfferingId]
        = touchedInstances.map(i => i >= deleteIndex + 1 ? i - 1 : i);
  }



  confirmOtherOfferingDelete = false;
  confirmTravelDeleteAll = false;
  confirmServiceOfferingDelete = false;

  public get confirmServiceOfferingDeleteVal(): boolean {
    return this.confirmServiceOfferingDelete;
  }

  public get confirmOtherOfferingDeleteVal(): boolean {
    return this.confirmOtherOfferingDelete;
  }

  public get confirmTravelDeleteAllVal(): boolean {
    return this.confirmTravelDeleteAll;
  }

  @Action
  public async setConfirmServiceOfferingDelete(bool: boolean): Promise<void> {
    this.doSetConfirmServiceOfferingDelete(bool);
  }
  @Mutation
  public doSetConfirmServiceOfferingDelete(bool: boolean): void {
    this.confirmServiceOfferingDelete = bool;
  }

  @Action
  public setConfirmOtherOfferingDelete(bool: boolean): void {
    this.doSetConfirmOtherOfferingDelete(bool);
  }
  @Mutation
  public doSetConfirmOtherOfferingDelete(bool: boolean): void {
    this.confirmOtherOfferingDelete = bool;
  }

  @Action
  public setConfirmTravelDeleteAll(bool: boolean): void {
    this.doSetConfirmTravelDeleteAll(bool);
  }
  @Mutation
  public doSetConfirmTravelDeleteAll(bool: boolean): void {
    this.confirmTravelDeleteAll = bool;
  }

  @Action
  public async deleteOtherOffering(): Promise<void> {
    await this.doDeleteOtherOffering();
    await this.checkServiceOfferingTypesSelected();
  }

  @Mutation
  public async doDeleteOtherOffering(): Promise<void> {
    const groupIdToDelete = this.currentGroupId.toLowerCase();
    const offeringToDelete = this.DOWObject.find(
      o => o.serviceOfferingGroupId.toLowerCase() === groupIdToDelete
    );
    if (offeringToDelete
        && offeringToDelete.otherOfferingData
        && offeringToDelete.otherOfferingData.length > 0
    ) {
      this.currentGroupRemovedForNav = true;
      const serviceOfferingGroupId = offeringToDelete.serviceOfferingGroupId;
      offeringToDelete.otherOfferingData?.forEach((instance) => {
        deleteOtherOfferingInstanceFromIGCECostEstimate(
            instance.sysId as string,
            serviceOfferingGroupId
        );
      })

      setTimeout(()=>{
        offeringToDelete.otherOfferingData?.forEach((instance) => {
          deleteOtherOfferingInstanceFromSNOW(instance.sysId as string, this.currentGroupId);
        }), 0
      })
    }
    const offeringIndex = this.DOWObject.findIndex(
      o => o.serviceOfferingGroupId.toLowerCase() === groupIdToDelete
    );
    if (offeringIndex > -1) {
      this.DOWObject.splice(offeringIndex, 1);
      if (this.DOWObject.length) {
        // remove group from touched obj to prevent validation on load if adding group again
        delete this.otherOfferingInstancesTouched[groupIdToDelete];

        const nextGroupId = this.DOWObject.length === offeringIndex
          ? this.DOWObject[offeringIndex - 1].serviceOfferingGroupId
          : this.DOWObject[offeringIndex].serviceOfferingGroupId;
        this.currentGroupId = nextGroupId;
      }
    }
  }
  // ******************************************************************
  // ******************************************************************
  // END OtherServiceOfferings - COMPUTE/GENERAL_XAAS/DATABSE - data/methods
  // ******************************************************************
  // ******************************************************************


  @Mutation
  public setCurrentOffering(value: { name: string, sysId: string }): void {
    this.currentOfferingName = value.name;
    this.currentOfferingSysId = value.sysId;
  }

  @Mutation
  public async setCurrentOfferingGroupId(value: string): Promise<void> {
    this.currentGroupId = value;
  }

  @Action
  public async getCurrentOfferingGroupId(): Promise<string> {
    return this.currentGroupId;
  }

  @Action({ rawError: true })
  public async getClassificationInstances(): Promise<DOWClassificationInstance[]> {
    const currentGroup
        = this.DOWObject.find((obj) => obj.serviceOfferingGroupId === this.currentGroupId);
    const currentOffering
        = currentGroup?.serviceOfferings.find((obj) => obj.name === this.currentOfferingName);
    if (currentOffering && currentOffering.classificationInstances) {
      return currentOffering.classificationInstances;
    }
    return [];
  }

  @Mutation
  public setStoreData(sessionData: string): void {
    try {
      const sessionDataObject = JSON.parse(sessionData);
      Object.keys(sessionDataObject).forEach((property) => {
        Vue.set(this, property, sessionDataObject[property]);
      });
    } catch (error) {
      throw new Error("error restoring session for contact data store");
    }
  }

  @Mutation
  public setUserSelectedServices(value: SelectedServiceOfferingDTO[]): void {
    this.userSelectedServiceOfferings = value;
    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_DESCRIPTION_OF_WORK_KEY
    );
  }

  @Mutation
  public updateDOWObjectWithSavedIds(values: ServiceOfferingProxy[]): void {

    values.forEach(value=> {
      const data = this.DOWObject[value.dowServiceGroupIndex]
        .serviceOfferings[value.dowServiceIndex];

      //updated classification instances with ids
      data.classificationInstances?.forEach((instance, index)=> {
        const savedInstanceProxy =
            value.classificationInstances
              .find(cInstance=>cInstance.dowClassificationInstanceIndex === index);
        if(savedInstanceProxy)
        {
          instance.sysId = savedInstanceProxy?.classificationInstance.sys_id;
        }
      })

      //update service instances with ids
      data.serviceId = value.serviceOffering.sys_id || "";
    })

    storeDataToSession(
      this,
      this.sessionProperties,
      ATAT_DESCRIPTION_OF_WORK_KEY
    );
  }


  @Action({ rawError: true })
  public async getServiceOfferingGroups(): Promise<SystemChoiceDTO[]> {
    await this.ensureInitialized();
    return this.serviceOfferingGroups;
  }

  @Action({ rawError: true })
  public async getServiceOfferings(): Promise<DOWServiceOffering[]> {
    await this.ensureInitialized();
    const serviceOfferingsForGroup = this.serviceOfferings.filter((obj) => {
      return obj.service_offering_group === this.currentGroupId;
    })
    //map services offerings from the service offering list
    const serviceOfferings: DOWServiceOffering[] = [];
    const dowOfferings = this.serviceOfferingsForGroup;
    const acquisitionPackageId = AcquisitionPackage.packageId;

    serviceOfferingsForGroup.forEach((obj) => {

      //does the saved offering exist in DOW store?
      const offering = {
        name: obj.name,
        sys_id: obj.sys_id || "",
        acquisitionPackageSysId: acquisitionPackageId,
        sequence: obj.sequence,
        description: obj.description,
        serviceId: "",
        otherOfferingName: "",
      };
      if (obj.name === "Other") {
        const otherOffering = dowOfferings.find(o => o.serviceId === this.currentGroupId
            && o.name === "Other");
        offering.otherOfferingName = otherOffering ? otherOffering.otherOfferingName as string : "";
      }

      serviceOfferings.push(offering);

    });

    serviceOfferings.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
    return serviceOfferings;
  }

  @Action({ rawError: true })
  public getOfferingGroupName(): string {
    const currentGroup = this.serviceOfferingGroups.find((obj) => {
      return obj.value === this.currentGroupId;
    });
    return currentGroup?.label || "";
  }

  @Action({ rawError: true })
  public getServiceOfferingName(): string {
    return this.currentOfferingName;
  }

  @Action({ rawError: true })
  async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  @Action({ rawError: true })
  public async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    const sessionRestored = retrieveSession(ATAT_DESCRIPTION_OF_WORK_KEY);
    if (sessionRestored) {
      this.setStoreData(sessionRestored);
      this.setInitialized(true);
    } else {
      try {
        await Promise.all([
          this.loadServiceOfferings(),
          this.LoadServiceOfferingGroups(),
        ]);
        storeDataToSession(
          this,
          this.sessionProperties,
          ATAT_DESCRIPTION_OF_WORK_KEY
        );
        this.setInitialized(true);
      } catch (error) {
        console.error(error);
      }
    }
    this.checkServiceOfferingTypesSelected();
    await DescriptionOfWork.loadArchitecturalDesignByPackageId()
  }

  @Action({ rawError: true })
  public async loadServiceOfferings(): Promise<void> {
    try {
      const serviceOfferings = await api.serviceOfferingTable.all();
      this.setServiceOfferings(serviceOfferings);
    } catch (error) {
      throw new Error(`error loading Service Offerings ${error}`);
    }
  }

  @Action({rawError: true})
  public async LoadServiceOfferingGroups(): Promise<void> {
    try {
      const serviceOfferingGroups = await api.systemChoices
        .getChoices(ServiceOfferingTableName, "service_offering_group");
      // TODO - change values of none apply options in service now
      const offeringGroups = serviceOfferingGroups.filter(obj => obj.value !== "NONE_APPLY");
      this.setServiceOfferingGroups(offeringGroups);
    } catch (error) {
      throw new Error(`error loading Service Offering Groups ${error}`);
    }
  }

  @Action({rawError: true})
  public async removeClassificationInstances(classificationInstances:string[]): Promise<void>{
    try {

      const calls:Promise<void>[] = [];
      classificationInstances.forEach(async instance=> {

        if(instance.length> 0){
          await IGCEStore.deleteIgceEstimateClassificationInstance(instance);
          calls.push(api.classificationInstanceTable.remove(instance))
        }
      })
      await Promise.all(calls);
    } catch (error) {
      //do nothing here we'll delete optimistically
    }
  }

  @Action({rawError: true})
  public async removeUserSelectedService(service: SelectedServiceOfferingDTO): Promise<void>{
    try {


      await api.selectedServiceOfferingTable.remove(service.sys_id || "");

      const classificationInstances = service.classification_instances.split(',');

      if(classificationInstances && classificationInstances.length)
      {
        await this.removeClassificationInstances(classificationInstances);
      }

    } catch (error) {
      //do nothing here we'll delete optimistically
    }
  }

  @Action({rawError: true})
  public async removeUserSelectedServices(requiredServices: SelectedServiceOfferingDTO[])
      : Promise<void>{
    try {

      const calls = requiredServices.reduce<Promise<void>[]>((previous, current)=>  {
        const values = [...previous];

        if(current.sys_id){
          values.push(this.removeUserSelectedService(current));
        }
        return values;

      }, []);
      await Promise.all(calls);

    } catch (error) {
      //to nothing here we're deleting stuff optimistically
    }
  }

  @Action({rawError: true})
  public async reset(): Promise<void> {
    sessionStorage.removeItem(ATAT_DESCRIPTION_OF_WORK_KEY);
    this.doReset();
  }

  @Mutation
  private doReset(): void {
    this.summaryBackToContractDetails = false;
    this.currentGroupRemoved = false;
    this.currentGroupRemovedForNav = false;
    this.lastGroupRemoved = false;
    this.initialized = false;
    this.isIncomplete = true;
    this.serviceOfferings = [];
    this.serviceOfferingGroups = [];
    this.DOWObject = [];
    this.userSelectedServiceOfferings = [];
    this.currentGroupId = "";
    this.currentOfferingName = "";
    this.currentOfferingSysId = "";
    this.xaaSNoneValue = "XaaS_NONE";
    this.cloudNoneValue = "Cloud_NONE";
    this.returnToDOWSummary = false;
    this.reviewGroupFromSummary = false;
    this.addGroupFromSummary = false;
    this.currentOtherServiceInstanceNumber = 0;
    this.otherOfferingInstancesTouched = {};
    this.confirmOtherOfferingDelete = false;
    this.confirmServiceOfferingDelete = false;
    this.DOWArchitectureNeeds = _.cloneDeep(defaultDOWArchitecturalNeeds);
    this.XaaSNoneSelected = false;
    this.cloudNoneSelected = false;
  }
}

const DescriptionOfWork = getModule(DescriptionOfWorkStore);
export default DescriptionOfWork;
