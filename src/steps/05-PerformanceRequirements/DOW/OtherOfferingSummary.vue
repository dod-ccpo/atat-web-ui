<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Your {{ serviceGroupVerbiageInfo.headingSummary }}
          </h1>
          <p>
            If you need more {{ serviceGroupVerbiageInfo.typeForText }}s, add them below. 
            You can also edit or delete any info from the 
            {{ serviceGroupVerbiageInfo.typeForText }}s that 
            you have already entered. When you’re done, click "Continue" and we will 
            move on to your 
            <span v-if="nextOfferingGroupStr && !returnToDOWSummary">
              {{ nextOfferingGroupStr }} requirements.
            </span> 
            <span v-else>performance requirements summary.</span>
          </p>

          <div 
            v-if="tableData.length === 0"
            class="w-100 py-10 border1 border-rounded border-base-lighter text-center mb-10 mt-10" 
          >
            You do not have any requirements yet.
          </div>

          <v-data-table
            v-if="tableData.length"
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _offering-instances mt-10"
            :class="{ '_first-col-nowrap': isCompute || isDatabase }"
            :hide-default-footer="true"
            no-data-text="You do not have any requirements yet."
          >
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.typeOrTitle="{ item }">
              <div v-html="item.typeOrTitle" 
                :class="{'text-clamp--1-line' : hasStatementColumn }"
              ></div>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <button
                :id="'EditButton_' + item.instanceNumber"
                @click="editInstance(item)"
                class="mr-2"
              >
                <ATATSVGIcon name="edit" height="19" width="19" />
              </button>

              <button
                :id="'DeleteButton_' + item.instanceNumber"
                @click="confirmDeleteInstance(item)"
                class="ml-2"
              >
                <ATATSVGIcon name="remove" height="18" width="14" />
              </button>
            </template>

          </v-data-table>  
          <hr class="mt-0" v-if="tableData.length" /> 
          <v-btn
            id="AddInstance"
            role="link" 
            class="secondary _normal _small-text mt-5"
            :ripple="false"
            @click="addInstance()"
          >
            <ATATSVGIcon 
              color="primary" 
              height="17" 
              width="18" 
              name="control-point" 
              class="mr-2"
            />
            Add 
            <span v-if="tableData.length">&nbsp;another&nbsp;</span> 
            {{ serviceGroupVerbiageInfo.typeForText }}
          </v-btn>  
        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      id="DeleteInstanceModal"
      :showDialog="showDeleteInstanceDialog"
      :title="deleteInstanceModalTitle"
      no-click-animation
      :okText="'Delete ' + serviceGroupVerbiageInfo.typeForText"
      width="450"
      @ok="deleteInstance"
      @cancelClicked="showDeleteInstanceDialog = false"
    >
      <template #content>
        <p class="body">
          This {{ serviceGroupVerbiageInfo.typeForText }} will be removed from your 
          {{ serviceGroupVerbiageInfo.offeringName }} requirements. Any details about this 
          {{ serviceGroupVerbiageInfo.typeForText }} will not be saved.
        </p>
      </template>
    </ATATDialog>

    <ATATDialog
      id="DeleteAllInstancesModal"
      :showDialog="showDeleteOfferingDialog"
      :title="'Delete all ' + serviceGroupVerbiageInfo.offeringName + 
        ' ' + serviceGroupVerbiageInfo.typeForText + 's?'"
      no-click-animation
      :okText="'Delete ' + serviceGroupVerbiageInfo.offeringName"
      width="450"
      @ok="deleteOffering"
      @cancelClicked="cancelDeleteOffering"
    >
      <template #content>
        <p class="body">
          This action will remove the “{{ serviceGroupVerbiageInfo.offeringName }}” 
          category from your performance requirements. Any details about your 
          {{ serviceGroupVerbiageInfo.typeForText }}<span v-if="tableData.length > 1">s</span> 
          will not be saved.
        </p>
      </template>
    </ATATDialog>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import DescriptionOfWork, 
{ instanceEnvTypeOptions, trainingTypeOptions } from "@/store/descriptionOfWork";

import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";
import { OtherServiceOfferingData, OtherServiceSummaryTableData } from "../../../../types/Global";
import { buildClassificationLabel, toTitleCase } from "@/helpers";
import _ from 'lodash';
import { ReferenceColumn } from "@/api/models";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }
})

export default class OtherOfferingSummary extends Vue {
  public isCompute = false;
  public isGeneralXaaS = false;
  public isDatabase = false;
  public isStorage = false;
  public isTraining = false;
  public hasOnSiteColumn = false;
  public hasStatementColumn = false;

  public deleteInstanceModalTitle = "";

  public offeringInstances: OtherServiceOfferingData[] = [];

  public tableHeaders: Record<string, string>[] = [];
  public tableData: OtherServiceSummaryTableData[] = [];

  public nextOfferingGroupStr = "";
  public showDeleteInstanceDialog = false;
  public instanceNumberToDelete = 0;
  public showDeleteOfferingDialog = false;
  public missingEnvironmentType = false;
  public returnToDOWSummary = false;

  public serviceGroupVerbiageInfo: Record<string, string> = {};

  get confirmOfferingDelete(): boolean {
    return DescriptionOfWork.confirmOtherOfferingDeleteVal;
  }

  // eslint-disable-next-line max-len
  public rowErrorMessage = `<div class="d-flex align-center"><svg viewBox="0 0 18 18" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M9.83366 13.6641H10.3337V13.1641V11.4974V10.9974H9.83366H8.16699H7.66699V11.4974V13.1641V13.6641H8.16699H9.83366ZM9.83366 10.3307H10.3337V9.83073V4.83073V4.33073H9.83366H8.16699H7.66699V4.83073V9.83073V10.3307H8.16699H9.83366ZM1.16699 8.9974C1.16699 4.67354 4.67647 1.16406 9.00033 1.16406C13.3242 1.16406 16.8337 4.67354 16.8337 8.9974C16.8337 13.3213 13.3242 16.8307 9.00033 16.8307C4.67647 16.8307 1.16699 13.3213 1.16699 8.9974Z" fill="#c60634" stroke="#c60634"/></svg><span class="font-size-12 text-error d-inline-block ml-1">Missing info</span></div>`;

  @Watch("confirmOfferingDelete")
  public confirmOfferingDeleteChanged(newVal: boolean): void {
    if (newVal && this.tableData.length > 0) {
      this.showDeleteOfferingDialog = newVal;
    } else if (newVal) {
      this.deleteOffering();
    }
  }

  public navigate(): void {
    // route to ServiceOfferings or DOW Summary
    this.$router.push({
      name: "pathResolver",
      params: {
        resolver: "OfferGroupOfferingsPathResolver",
        direction: "next"
      },
    }).catch(() => console.log("avoiding redundant navigation"));
  }

  public async addInstance(): Promise<void> {
    const lastInstanceNumber = await DescriptionOfWork.getLastOtherOfferingInstanceNumber();
    await DescriptionOfWork.setCurrentOtherOfferingInstanceNumber(lastInstanceNumber + 1);
    this.navigate();
  }

  public async editInstance(item: OtherServiceSummaryTableData): Promise<void> {
    await DescriptionOfWork.setCurrentOtherOfferingInstanceNumber(item.instanceNumber);
    this.navigate();
  }
  public confirmDeleteInstance(item: OtherServiceSummaryTableData): void {
    this.instanceNumberToDelete = item.instanceNumber;
    this.deleteInstanceModalTitle = "Delete " 
      + toTitleCase(this.serviceGroupVerbiageInfo.typeForText) 
      + ' #' + this.instanceNumberToDelete + '?';
    this.showDeleteInstanceDialog = true;
  }

  public async deleteInstance(): Promise<void> {
    await DescriptionOfWork.deleteOtherOfferingInstance(this.instanceNumberToDelete);
    await this.buildTableData();
    this.showDeleteInstanceDialog = false;
  }

  public async deleteOffering(): Promise<void> {
    await DescriptionOfWork.deleteOtherOffering();
    DescriptionOfWork.setConfirmOtherOfferingDelete(false);
    this.navigate();
  }

  public cancelDeleteOffering(): void {
    this.showDeleteOfferingDialog = false;
    DescriptionOfWork.setConfirmOtherOfferingDelete(false);
  }

  public async buildTableData(): Promise<void> {
    this.tableData = [];
    const allPeriods = await Periods.getAllPeriods();
    const classificationLevels = ClassificationRequirements.selectedClassificationLevels;

    this.offeringInstances = await DescriptionOfWork.getOtherOfferingInstances();
    this.offeringInstances.forEach(async (instance) => {
      const instanceClone = _.cloneDeep(instance);
      let instanceData: OtherServiceSummaryTableData = { instanceNumber: 1 };
      let isValid = true;
      let typeOrTitle = "";
      let classificationLevel = "";
      let duration = "";
      let trainingType = "";
      let personnelOnsiteAccess = "";
      let performance = "";

      // -----------------------------------------------------------------
      // COMPUTE AND DATABASE
      // -----------------------------------------------------------------
      if (this.isCompute || this.isDatabase) {
        const typeTitle = this.isCompute ? "Type" : "Database Type";
        this.tableHeaders = [    
          { text: "", value: "instanceNumber", width: "50" },
          { text: typeTitle, value: "typeOrTitle" },
          { text: "Classification", value: "classification" },
          { text: "Quantity", value: "qty" },
          { text: "vCPU", value: "vCPU" },
          { text: "Memory", value: "memory" },
          { text: "Storage", value: "storageAmount" },
          { text: "Performance", value: "performance" },
          { text: "", value: "actions", width: "75" },
        ];

        if (!instanceClone.environmentType) {
          typeOrTitle = `<div class="text-error font-weight-500">Unknown</div>`;
        }
  

        if (this.isCompute) {
          const selectedEnv = instanceEnvTypeOptions.find(
            obj => obj.value === instanceClone.environmentType
          );
          if (selectedEnv) {
            typeOrTitle = selectedEnv.label;
          }
          if (instanceClone.performanceTier) {
            performance = toTitleCase(instanceClone.performanceTier || "");
            performance += performance === "General" ? " purpose" : " optimized";
          }

        } else {
          typeOrTitle = toTitleCase(instanceClone.databaseType || "");
          performance = instanceClone.networkPerformance || "";
        }
      // -----------------------------------------------------------------
      // STORAGE
      // -----------------------------------------------------------------
      } else if (this.isStorage) {
        this.tableHeaders = [    
          { text: "", value: "instanceNumber", width: "50" },
          { text: "Classification", value: "classification" },
          { text: "Storage Type", value: "storageType", width: "50%" },
          { text: "Storage Size", value: "storageAmount", width: "50%" },
          { text: "", value: "actions", width: "75" },
        ];
      // -----------------------------------------------------------------
      // TRAINING
      // -----------------------------------------------------------------
      } else if (this.isTraining) {
        this.tableHeaders = [    
          { text: "", value: "instanceNumber", width: "50" },
          { text: "Title", value: "typeOrTitle", width: "30%" },
          { text: "Classification", value: "classification", width: "20%" },
          { text: "Training format", value: "trainingType", width: "30%" },
          { text: "Duration", value: "duration", width: "20%"},
          { text: "", value: "actions", width: "75" },
        ];
        typeOrTitle = instanceClone.requirementTitle || "";

        const selectedTrainingType = trainingTypeOptions.find(
          obj => obj.value === instanceClone.trainingType
        );
        if (selectedTrainingType) {
          trainingType = selectedTrainingType.label;
        }
      // -----------------------------------------------------------------
      // GENERAL XAAS
      // -----------------------------------------------------------------
      } else {
        this.tableHeaders = [    
          { text: "", value: "instanceNumber", width: "50" },
          { text: "Statement of objectives", value: "typeOrTitle", width: "50%" },
          { text: "Classification", value: "classification" },
          { text: "On-site access", value: "personnelOnsiteAccess" },          
          { text: "Duration", value: "duration", width: "50%" },
          { text: "", value: "actions", width: "75" },
        ];

        if (!this.hasOnSiteColumn) {
          this.tableHeaders = this.tableHeaders.filter(
            obj => obj.value !== "personnelOnsiteAccess"
          );
        } else {
          personnelOnsiteAccess = instanceClone.personnelOnsiteAccess === "YES"
            ? "Required" : "Not required";
        }

        typeOrTitle = !instanceClone.descriptionOfNeed 
          ? `<div class="text-error font-weight-500">Unknown</div>`
          : instanceClone.descriptionOfNeed;
      }

      isValid = await this.validateInstance(instanceClone);
      if (!isValid) {
        typeOrTitle += this.rowErrorMessage
      }

      if (
        instanceClone.entireDuration === "NO" 
        && instanceClone.periodsNeeded.length 
        && allPeriods?.length
      ) {
        const periodsNeeded: string[] = [];
        instanceClone.periodsNeeded.forEach((sysId) => {
          const periodObj = allPeriods.find((obj) => obj.sys_id === sysId);
          if (periodObj) {
            let periodText = periodObj?.period_type.indexOf("BASE") > -1 
              ? "Base period" : "Option period " + (parseInt(periodObj.option_order) - 1);
            periodsNeeded.push(periodText);
          }
        });
        duration = periodsNeeded.join(", ");
      } else if (instanceClone.entireDuration === "YES") {
        duration = "Entire task order";
      }

      if (classificationLevels.length > 1) {
        const classificationObj = classificationLevels.find(obj => (
          obj.classification_level as ReferenceColumn).value === instanceClone.classificationLevel
        );
        if (classificationObj) {
          classificationLevel = buildClassificationLabel(classificationObj, "short");
        }
      } else {
        this.tableHeaders = this.tableHeaders.filter(obj => obj.value !== "classification");
      }
      
      const storageAmount = instanceClone.storageAmount
        ? this.isStorage
          ? `${instanceClone.storageAmount} ${instanceClone.storageUnit}` 
          : `${toTitleCase(instanceClone.storageType || "")}: 
            ${instanceClone.storageAmount} ${instanceClone.storageUnit}`
        : ""     

      instanceData = {
        instanceNumber: instanceClone.instanceNumber,
        typeOrTitle,
        classification: classificationLevel,
        duration: duration,
        qty: instanceClone.numberOfInstances,
        vCPU: instanceClone.numberOfVCPUs,
        memory: instanceClone.memoryAmount ? `${instanceClone.memoryAmount} GB` : "",
        storageType: toTitleCase(instanceClone.storageType || ""),        
        storageAmount,
        performance,
        personnelOnsiteAccess,
        trainingType,
      };

      this.tableData.push(instanceData);
    })
    // ensure sorted by instance number
    this.tableData.sort((a, b) => a.instanceNumber > b.instanceNumber ? 1 : -1);    
  }

  public async validateInstance(instance: OtherServiceOfferingData): Promise<boolean> {
    const instanceData: Record<string, any> = _.clone(instance);
    let isValid = true;
    let requiredFields: string[] = [];

    if (this.isCompute) {
      requiredFields = [
        "environmentType",
        "classificationLevel",
        "entireDuration",
        "memoryAmount",
        "anticipatedNeedUsage",
        "numberOfInstances",
        "numberOfVCPUs",
        "operatingSystem",
        "operatingSystemAndLicensing",
        "performanceTier",
        "storageAmount",
        "storageType",
      ];

    } else if (this.isGeneralXaaS) {
      requiredFields = [
        "classificationLevel",
        "anticipatedNeedUsage",
        "entireDuration",
      ];
      if (instanceData.entireDuration === "NO" && !instanceData.periodsNeeded.length) {
        isValid = false;
      }
    }

    requiredFields.forEach((field) => {
      if (instanceData[field] === "") {
        isValid = false;
      }
    });

    return isValid;
  }

  public async loadOnEnter(): Promise<void> {
    this.returnToDOWSummary = await DescriptionOfWork.getReturnToDOWSummary();
    this.serviceGroupVerbiageInfo = await DescriptionOfWork.getServiceGroupVerbiageInfo();

    const currentGroupId = await DescriptionOfWork.getCurrentOfferingGroupId();
    const offering = currentGroupId.toLowerCase();
    this.isCompute = offering === "compute";
    this.isGeneralXaaS = offering === "general_xaas";
    this.isDatabase = offering === "database";
    this.isStorage = offering === "storage";
    this.isTraining = offering === "training";
    this.hasOnSiteColumn 
      = ["documentation_support", "help_desk_services", "advisory_assistance"].includes(offering);
    this.hasStatementColumn = this.hasOnSiteColumn || offering.indexOf("general") > -1;

    await this.buildTableData();

    const DOWObject = await DescriptionOfWork.getDOWObject();
    if (DOWObject && DOWObject.length > 1) {
      const offeringIndex = DOWObject.findIndex(
        obj => obj.serviceOfferingGroupId.toLowerCase() === offering
      );
      if (offeringIndex < DOWObject.length - 1) {
        const nextOfferingGroupId = DOWObject[offeringIndex + 1].serviceOfferingGroupId;
        const offeringGroups = await DescriptionOfWork.getServiceOfferingGroups();
        const nextOfferingGroupObj = offeringGroups.find(
          obj => obj.value === nextOfferingGroupId
        );
        if (nextOfferingGroupObj) {
          this.nextOfferingGroupStr = nextOfferingGroupObj.label;
        }
      }
    }
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };

}

</script>
