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
  ClassificationInstanceDTO,
  CloudSupportEnvironmentInstanceDTO,
  ComputeEnvironmentInstanceDTO,
  DatabaseEnvironmentInstanceDTO,
  EnvironmentInstanceDTO,
  ReferenceColumn,
  SelectedServiceOfferingDTO,
  ServiceOfferingDTO,
  StorageEnvironmentInstanceDTO,
  SystemChoiceDTO,
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
  DOWPoP,
  StorageUnit,
  RadioButton,
} from "../../../types/Global";

import _, { differenceWith, first, last } from "lodash";
import ClassificationRequirements from "@/store/classificationRequirements";
import AcquisitionPackage from "../acquisitionPackage";
import Periods from "../periods";
import { buildClassificationLabel } from "@/helpers";
import { AxiosRequestConfig } from "axios";


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

const saveOrUpdateSelectedServiceOffering =
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
      tempObject.acquisition_package = selectedServiceOffering.acquisitionPackageSysId;
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
      classificationInstance: DOWClassificationInstance
    ):Promise<string> => {
      const tempObject: any = {};
      let objSysId = "";

      if(classificationInstance.selectedPeriods){
        tempObject.selected_periods = classificationInstance.selectedPeriods.join(",") || "";
      }
      const classificationLevel =
          typeof classificationInstance.classificationLevelSysId === "object"
            ? (classificationInstance.classificationLevelSysId as ReferenceColumn).value as string
            : classificationInstance.classificationLevelSysId as string;

      tempObject.classification_level = classificationLevel;
      tempObject.usage_description = classificationInstance.anticipatedNeedUsage;
      tempObject.need_for_entire_task_order_duration = classificationInstance.entireDuration;

      if(classificationInstance.sysId)
        tempObject.sys_id = classificationInstance.sysId;

      if(tempObject.sys_id){
        await api.classificationInstanceTable.update(
          tempObject.sys_id,
            tempObject as ClassificationInstanceDTO
        );
        objSysId = tempObject.sys_id;
      } else {
        const savedObject = await api.classificationInstanceTable.create(
            tempObject as ClassificationInstanceDTO
        );

        objSysId = savedObject.sys_id as string;
      }

      return objSysId;
    };

const saveOrUpdateOtherServiceOffering =
    async (
      serviceOffering: OtherServiceOfferingData,
      offeringType: string
    ):Promise<string> => {
      const tempObject: any = {};
      let objSysId = "";

      tempObject.acquisition_package = serviceOffering.acquisitionPackageSysId;
      tempObject.anticipated_need_or_usage = serviceOffering.descriptionOfNeed;
      tempObject.classification_level = serviceOffering.classificationLevel;
      tempObject.instance_name = serviceOffering.requirementTitle;
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
      tempObject.selected_periods = serviceOffering.periodsNeeded.join(",");
      tempObject.storage_amount = serviceOffering.storageAmount;
      tempObject.storage_type = serviceOffering.storageType;
      tempObject.storage_unit = serviceOffering.storageUnit;

      if(serviceOffering.sysId)
        tempObject.sys_id = serviceOffering.sysId;

      switch(offeringType){
      case "compute":
        tempObject.environment_type = serviceOffering.environmentType;
        tempObject.operating_environment = serviceOffering.operatingEnvironment;
        tempObject.operating_system_licensing = serviceOffering.operatingSystemAndLicensing;
        if(tempObject.sys_id){
          await api.computeEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as ComputeEnvironmentInstanceDTO
          );
          objSysId = tempObject.sys_id;
        } else {
          const savedObject = await api.computeEnvironmentInstanceTable.create(
                tempObject as ComputeEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
        }
        break;
      case "database":
        tempObject.database_licensing = serviceOffering.databaseLicensing;
        tempObject.database_type = serviceOffering.databaseType;
        tempObject.database_type_other = serviceOffering.databaseTypeOther;
        tempObject.network_performance = serviceOffering.networkPerformance;
        if(tempObject.sys_id){
          await api.databaseEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as DatabaseEnvironmentInstanceDTO
          );
          objSysId = tempObject.sys_id;
        } else {
          const savedObject = await api.databaseEnvironmentInstanceTable.create(
                tempObject as DatabaseEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
        }
        break;
      case "storage":
        if(tempObject.sys_id){
          await api.storageEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as StorageEnvironmentInstanceDTO
          );
          objSysId = tempObject.sys_id;
        } else {
          const savedObject = await api.storageEnvironmentInstanceTable.create(
                tempObject as StorageEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
        }
        break;
      case "general_xaas":
        if(tempObject.sys_id){
          await api.xaaSEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as XaasEnvironmentInstanceDTO
          )
          objSysId = tempObject.sys_id;
        } else {
          const savedObject = await api.xaaSEnvironmentInstanceTable.create(
                tempObject as XaasEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
        }
        break;
      case "advisory_assistance":
      case "help_desk_services":
      case "documentation_support":
      case "general_cloud_support":
      case "training":
      case "portability_plan":
        tempObject.can_train_in_unclass_env = serviceOffering.canTrainInUnclassEnv;
        tempObject.personnel_onsite_access = serviceOffering.personnelOnsiteAccess;
        tempObject.personnel_requiring_training = serviceOffering.trainingPersonnel;
        tempObject.service_type = offeringType.toUpperCase();
        tempObject.training_facility_type = serviceOffering.trainingFacilityType;
        tempObject.training_format = serviceOffering.trainingType;
        tempObject.training_location = serviceOffering.trainingLocation;
        tempObject.training_requirement_title = serviceOffering.trainingRequirementTitle;
        tempObject.training_time_zone = serviceOffering.trainingTimeZone;
        tempObject.ts_contractor_clearance_type = serviceOffering.tsContractorClearanceType;
        if(tempObject.sys_id){
          await api.cloudSupportEnvironmentInstanceTable.update(
            tempObject.sys_id,
                tempObject as CloudSupportEnvironmentInstanceDTO
          );
          objSysId = tempObject.sys_id;
        } else {
          const savedObject = await api.cloudSupportEnvironmentInstanceTable.create(
                tempObject as CloudSupportEnvironmentInstanceDTO
          );
          objSysId = savedObject.sys_id as string;
        }
        break;
      default:
        console.log("DOW object saving for this type is not implemented yet.");
        objSysId = "";
        break;
      }

      return objSysId;
    };

const mapClassificationInstanceFromDTO = (
  value: ClassificationInstanceDTO
): DOWClassificationInstance => {
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
    labelShort: labelShort
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

  const acquisitionPackageSysId =
      typeof value.acquisition_package === "object"
        ? value.acquisition_package.value as string
        : value.acquisition_package as string;

  const classificationLevel =
      typeof value.classification_level === "object"
        ? value.classification_level.value as string
        : value.classification_level as string;

  const region =
      typeof value.region === "object"
        ? value.region.value as string
        : value.region as string;

  const result: OtherServiceOfferingData = {
    acquisitionPackageSysId: acquisitionPackageSysId,
    descriptionOfNeed: value.anticipated_need_or_usage,
    classificationLevel: classificationLevel,
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
    region: region,
    periodsNeeded: value.selected_periods?.split(",") || [],
    storageAmount: value.storage_amount,
    storageType: value.storage_type,
    storageUnit: value.storage_unit as StorageUnit,
    sysId: value.sys_id,
    instanceNumber: index
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
  acquisition_package: ""
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
  hasXaasService = false
  anticipatedUsersAndDataHasBeenVisited = false
  returnToDOWSummary = false;
  reviewGroupFromSummary = false;
  addGroupFromSummary = false;
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
    'COMPUTE'
  ];

  cloudSupportServices = [
    "PORTABILITY_PLAN",
    "ADVISORY_ASSISTANCE",
    "HELP_DESK_SERVICES",
    "TRAINING",
    "DOCUMENTATION_SUPPORT",
    "GENERAL_CLOUD_SUPPORT"
  ]

  public DOWHasArchitecturalDesignNeeds: boolean | null = null;
  public DOWArchitectureNeeds = defaultDOWArchitecturalNeeds;

  @Action({rawError: true})
  public async setDOWHasArchitecturalDesign(value: boolean): Promise<void> {
    this.doSetDOWHasArchitecturalDesign(value);
  }

  @Mutation
  public doSetDOWHasArchitecturalDesign(value: boolean): void {
    this.DOWHasArchitecturalDesignNeeds = value;
  }

  @Action({rawError: true})
  public async setDOWArchitecturalDesign(value: ArchitecturalDesignRequirementDTO): Promise<void> { 
    const sysId = await this.saveDOWArchitecturalDesign(value);
    value.sys_id = sysId;
    value.acquisition_package = AcquisitionPackage.acquisitionPackage?.sys_id as string;
    this.doSetDOWArchitecturalDesign(value);
  }

  @Mutation
  public doSetDOWArchitecturalDesign(value: ArchitecturalDesignRequirementDTO): void {
    this.DOWArchitectureNeeds = this.DOWArchitectureNeeds
      ? Object.assign(this.DOWArchitectureNeeds, value)
      : value;
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
  public async getDOWArchitecturalNeeds(): Promise<ArchitecturalDesignRequirementDTO> {
    return this.DOWArchitectureNeeds;
  }

  @Action({rawError: true})
  public async loadDOWfromAcquistionPackageId(sysId: string): Promise<void> {
    const requestConfig: AxiosRequestConfig = {
      params: {
        sysparm_query: "^acquisition_packageIN" + sysId,
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
    const storageItems = await api.databaseEnvironmentInstanceTable.getQuery(requestConfig);
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
            acquisitionPackageSysId: (
                offering.acquisition_package as ReferenceColumn).value as string,
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
    return this.DOWObject.filter(
      obj => obj.serviceOfferingGroupId.indexOf("NONE") === -1
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
      return currentGroup.serviceOfferings.flatMap(offering =>
        offering.sys_id === "Other" ? "Other" : offering.name);
    }
    return [""];
  }

  public get otherServiceOfferingEntry(): string {
    const otherServiceOffer = this.serviceOfferingsForGroup
      .find(offering=>offering.sys_id === "Other");
    return otherServiceOffer ? otherServiceOffer.name : "";
  }

  public get currentOfferingGroupHasOfferings(): boolean {
    return this.serviceOfferingsForGroup.length > 0;
  }

  @Mutation
  public checkForXaas(): void {
    if(this.DOWObject){
      let xaasServiceFound = false
      this.DOWObject.forEach((service)=>{
        this.xaasServices.forEach((xaas)=>{
          if(xaas === service.serviceOfferingGroupId){
            xaasServiceFound = true
          }
        })
        this.hasXaasService = xaasServiceFound;
      })
    }
  }

  public summaryBackToContractDetails = false;

  @Mutation
  public setBackToContractDetails(bool: boolean): void {
    this.summaryBackToContractDetails = bool;
  }
  @Action
  public doSetAnticipatedUsersAndDataHasBeenVisited(): void {
    this.setAnticipatedUsersAndDataHasBeenVisited()
  }

  @Mutation
  public setAnticipatedUsersAndDataHasBeenVisited(): void {
    if(!this.hasXaasService){
      this.anticipatedUsersAndDataHasBeenVisited = false;
    }
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
  public setServiceOfferingGroups(value: SystemChoiceDTO[]) {
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

  @Action
  public async removeCurrentOfferingGroup(): Promise<void> {
    await this.setSelectedOfferings({selectedOfferingSysIds: [], otherValue: ""});
    this.doRemoveCurrentOfferingGroup();
  }

  // removes current offering group if user clicks  the "I don't need these cloud resources"
  // button or does not select any offerings and clicks "Continue" button
  @Mutation
  public doRemoveCurrentOfferingGroup(): void {
    if (!this.currentGroupRemoved) {
      this.currentGroupRemovedForNav = true;
      const groupIdToRemove = this.currentGroupId;
      const groupIndex = this.DOWObject.findIndex(
        e => e.serviceOfferingGroupId === groupIdToRemove
      );

      const DOWObjectBeforeRemoval = _.clone(this.DOWObject);
      // remove group from DOWObject
      this.DOWObject = this.DOWObject.filter(
        obj => obj.serviceOfferingGroupId !== groupIdToRemove
      );

      const onlyNoneRemain = this.DOWObject.every((e) => {
        return e.serviceOfferingGroupId.indexOf("NONE") > -1;
      });
      // check if last group was removed
      if (groupIndex === DOWObjectBeforeRemoval.length - 1 || onlyNoneRemain) {
        this.lastGroupRemoved = true;
        // set currentGroupId to previous if has one
        if (DOWObjectBeforeRemoval.length > 1 && !onlyNoneRemain) {
          this.currentGroupId = DOWObjectBeforeRemoval[groupIndex -1].serviceOfferingGroupId;

        } else {
          // removed group was last in DOWObject, clear currentGroupId
          this.currentGroupId = "";
        }
      } else {
        this.lastGroupRemoved = false;
        // set currentGroupId to next group in DOWObject
        this.currentGroupId = DOWObjectBeforeRemoval[groupIndex + 1].serviceOfferingGroupId;
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
    const group = this.serviceOfferingGroups.find(e => e.value === groupId)
    const offeringGroup: DOWServiceOfferingGroup = {
      serviceOfferingGroupId: groupId,
      sequence: group?.sequence || 99,
      serviceOfferings: []
    }
    this.DOWObject.push(offeringGroup);
  }

  @Action
  public async setSelectedOfferingGroups(selectedOfferingGroupIds: string[]): Promise<void> {
    await this.doSetSelectedOfferingGroups(selectedOfferingGroupIds);
    this.checkForXaas()
    this.setAnticipatedUsersAndDataHasBeenVisited()
  }

  @Mutation
  public doSetSelectedOfferingGroups(selectedOfferingGroupIds: string[]): void {
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
          if (!selectedOfferingGroupIds.includes(groupId)) {
            this.DOWObject.splice(index, 1);
          }
        });
        this.DOWObject.sort((a, b) => a.sequence > b.sequence ? 1 : -1);
      });
    } else {
      this.DOWObject = [];
    }
    this.currentGroupId = this.DOWObject.length > 0
    && this.DOWObject[0].serviceOfferingGroupId.indexOf("NONE") === -1
      ? this.DOWObject[0].serviceOfferingGroupId
      : "";
    this.currentOfferingName = "";
    this.currentOfferingSysId = "";
  }

  @Action
  public async setSelectedOfferings(
    { selectedOfferingSysIds, otherValue }: { selectedOfferingSysIds: string[], otherValue: string }
  ): Promise<void> {
    this.doSetSelectedServiceOffering({ selectedOfferingSysIds, otherValue });
    // await this.saveSelectedServiceOfferings();
  }

  @Action
  public async saveSelectedServiceOfferings(
  ): Promise<void> {
    const groupIndex
        = this.DOWObject.findIndex((obj) => obj.serviceOfferingGroupId === this.currentGroupId);

    if (groupIndex >= 0) {
      const currentOfferings = this.DOWObject[groupIndex].serviceOfferings;

      for(const offering of currentOfferings){
        const serviceOffering = this.serviceOfferings.find(item => item.name === offering.name);

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
          if (!currentOfferings.some((e) => e.name === foundOffering?.name)) {
            const name = foundOffering ? foundOffering.name : otherValue;
            const description = foundOffering ? foundOffering.description : "";
            const sequence = foundOffering ? foundOffering.sequence : "99";
            const serviceId = foundOffering ? foundOffering.service_offering_group : "";

            const offering = {
              name,
              other: otherValue,
              "sys_id": "",
              classificationInstances: [],
              description,
              sequence,
              serviceId
            }
            currentOfferings.push({
              ...offering,
              acquisitionPackageSysId: acquisitionPackageId
            });
          }
        });

        this.DOWObject[groupIndex].serviceOfferings.sort(
          (a, b) => parseInt(a.sequence) > parseInt(b.sequence) ? 1 : -1
        );
      }
      this.currentOfferingName = currentOfferings.length > 0
        ? currentOfferings[0].name : "";
      this.currentOfferingSysId = currentOfferings.length > 0
        ? currentOfferings[0].sys_id : "";
    }
  }

  @Action
  public async setOfferingDetails(instancesData: DOWClassificationInstance[]): Promise<void> {
    const updatedInstancesData: DOWClassificationInstance[] = [];

    for(const instanceData of instancesData){
      const dataSysId = await saveOrUpdateClassificationInstance(instanceData);
      instanceData.sysId = dataSysId as string;
      updatedInstancesData.push(instanceData);
    }

    this.doSetOfferingDetails(updatedInstancesData);
    this.saveSelectedServiceOfferings();
  }

  @Mutation
  public doSetOfferingDetails(instancesData: DOWClassificationInstance[]): void {
    const groupIndex = this.DOWObject.findIndex(
      obj => obj.serviceOfferingGroupId === this.currentGroupId
    );
    const offeringIndex = this.DOWObject[groupIndex].serviceOfferings.findIndex(
      obj => obj.sys_id === this.currentOfferingSysId
    );
    this.DOWObject[groupIndex].serviceOfferings[offeringIndex].classificationInstances
        = instancesData;
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

  @Action
  public async deleteOtherOfferingInstance(instanceNumber: number): Promise<void> {
    this.doDeleteOtherOfferingInstance(instanceNumber);
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
        const instanceIndex = otherOfferingObj.otherOfferingData.findIndex(
          obj => obj.instanceNumber === instanceNumber
        );
        otherOfferingObj.otherOfferingData.splice(instanceIndex, 1);
        for (let i = instanceIndex; i < otherOfferingObj.otherOfferingData.length; i++) {
          otherOfferingObj.otherOfferingData[i].instanceNumber
              = otherOfferingObj.otherOfferingData[i].instanceNumber - 1;
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

  confirmServiceOfferingDelete = false;

  public get confirmServiceOfferingDeleteVal(): boolean {
    return this.confirmServiceOfferingDelete;
  }

  public get confirmOtherOfferingDeleteVal(): boolean {
    return this.confirmOtherOfferingDelete;
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
  public async deleteOtherOffering(): Promise<void> {
    await this.doDeleteOtherOffering();
    this.checkForXaas()
    this.setAnticipatedUsersAndDataHasBeenVisited()
  }

  @Mutation
  public doDeleteOtherOffering(): void {
    const groupIdToDelete = this.currentGroupId.toLowerCase();
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
  public setCurrentOfferingGroupId(value: string): void {
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
      const savedInDown = dowOfferings.find(offering=>offering.sys_id === obj.sys_id);

      const offering = savedInDown ? savedInDown :{
        name: obj.name,
        "sys_id": obj.sys_id || "",
        acquisitionPackageSysId: acquisitionPackageId,
        sequence: obj.sequence,
        description: obj.description,
        serviceId: "",
      };

      serviceOfferings.push(offering);

    });

    // EJY need to update?
    const groupsWithNoOtherOption = ["ADVISORY", "TRAINING"];

    if (groupsWithNoOtherOption.indexOf(this.currentGroupId) === -1) {
      const otherOffering: DOWServiceOffering = {
        name: "Other",
        sys_id: "Other",
        acquisitionPackageSysId: acquisitionPackageId,
        sequence: "99",
        description: "",
        serviceId: "",
      };
      serviceOfferings.push(otherOffering);
    }


    //now map any from the DOW that might've been saved

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
      this.setServiceOfferingGroups(serviceOfferingGroups);
    } catch (error) {
      throw new Error(`error loading Service Offering Groups ${error}`);
    }
  }

  @Action({rawError: true})
  public async removeClassificationInstances(classificationInstances:
                                                 string[]): Promise<void>{



    try {

      const calls:Promise<void>[] = [];

      classificationInstances.forEach(instance=> {

        if(instance.length> 0){
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
    this.DOWHasArchitecturalDesignNeeds = null;
    this.DOWArchitectureNeeds = defaultDOWArchitecturalNeeds;
  }
}

const DescriptionOfWork = getModule(DescriptionOfWorkStore);
export default DescriptionOfWork;
