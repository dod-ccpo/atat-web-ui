<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Your {{ serviceGroupVerbiageInfo.headingSummary }}
          </h1>
          <p>
            If you need more {{ serviceGroupVerbiageInfo.typeForText }}s, add them below. You can
            also edit or delete any info from the {{ serviceGroupVerbiageInfo.typeForText }}s
            that you have already entered. When you’re done, click “Continue” and we will
            <span v-if="showSecurityNote">
              find out about your security requirements for these services.
            </span>
            <span v-else-if="nextOfferingGroupStr && !returnToDOWSummary">
              move on to your {{ nextOfferingGroupStr }} requirements.
            </span>
            <span v-else>wrap up this category.</span>
          </p>

          <div 
            v-if="tableData.length === 0"
            class="w-100 py-10 border1 _border-rounded border-base-lighter text-center mb-10 mt-10" 
          >
            You do not have any requirements yet.
          </div>

          <v-table
            v-if="tableData.length"
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _offering-instances mt-10"
            :class="{ '_first-col-nowrap': isCompute || isDatabase }"
            :hide-default-footer="true"
            no-data-text="You do not have any requirements yet."
          >
            <thead>
              <tr>
                <th
                  v-for="header in tableHeaders"
                  :key="header.title"
                  :id="header.title"
                  class="text-start sortable"
                >
                  {{ header.title }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="item in tableData"
                :key="item.typeOrTitle"
              >
                <td>
                  {{item.instanceNumber}}
                </td>
                <td>
                  <span
                    :class="{'text-clamp--1-line' : hasStatementColumn }"
                    v-html="item.typeOrTitle">
                  </span>
                  <span v-if="!item.isComplete" v-html=rowErrorMessage></span>
                </td>
                <td>
                  {{item.classification}}
                </td>
                <td v-if="isAdvisoryAssistance || isDocumentation|| isHelpDesk">
                  {{item.personnelOnsiteAccess}}
                </td>
                <td v-if="isTraining">
                  {{item.trainingType}}
                </td>
                <td v-if="!isCompute && !isDatabase">
                  {{item.duration}}
                </td>
                <td v-if="isStorage">
                  {{item.storageAmount}}
                </td>
                <td v-if="isCompute || isDatabase">
                  {{item.qty}}
                </td>
                <td v-if="isCompute || isDatabase">
                {{item.vCPU}}
                </td>
                <td v-if="isCompute || isDatabase">
                {{item.memory}}
                </td>
                <td v-if="isCompute || isDatabase">
                  {{item.storageAmount}}
                </td>
                <td v-if="isCompute || isDatabase">
                {{item.performance}}
                </td>
                <td>
                  <div class="d-flex">
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
                  </div>
                </td>
              </tr>
            </tbody>
             </v-table>
          <hr class="mt-0" v-if="tableData.length" /> 
          <v-btn
            id="AddInstance"
            role="link" 
            class="_secondary _normal _small-text mt-5"
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
/*eslint prefer-const: 1 */
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import { Component, Watch, Vue, toNative, Hook } from "vue-facing-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import DescriptionOfWork, 
{ instanceEnvTypeOptions, 
  trainingTypeOptions, 
  saveOrUpdateOtherServiceOffering
} from "@/store/descriptionOfWork";

import ClassificationRequirements from "@/store/classificationRequirements";
import Periods from "@/store/periods";
import { 
  DataTableHeader, 
  OtherServiceOfferingData, 
  OtherServiceSummaryTableData,
  SaveOnLeaveRefs,
} from "../../../../types/Global";
import { buildClassificationLabel, toTitleCase } from "@/helpers";
import _ from 'lodash';
import { ReferenceColumn } from "@/api/models";
import Summary from "@/store/summary";
 

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }
})

class OtherOfferingSummary extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public isCompute = false;
  public isGeneralXaaS = false;
  public isDatabase = false;
  public isStorage = false;
  public isTraining = false;
  public isGeneralCloudSupport = false;
  public isHelpDesk = false;
  public isAdvisoryAssistance = false;
  public isDocumentation = false;
  
  public hasOnSiteColumn = false;
  public hasStatementColumn = false;

  public deleteInstanceModalTitle = "";

  public offeringInstances: OtherServiceOfferingData[] = [];

  public tableHeaders: DataTableHeader[] = [];
  public tableData: OtherServiceSummaryTableData[] = [];

  public nextOfferingGroupStr = "";
  public showDeleteInstanceDialog = false;
  public instanceNumberToDelete = 0;
  public showDeleteOfferingDialog = false;
  public missingEnvironmentType = false;
  public returnToDOWSummary = false;

  public currentGroupId = "";

  public serviceGroupVerbiageInfo: Record<string, string> = {};
  public showSecurityNote = false;

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
      query: {
        resolver: "ServiceOfferingsPathResolver",
        direction: "next"
      },
    }).catch(() => console.log("avoiding redundant navigation"));
  }

  public async addInstance(): Promise<void> {
    const lastInstanceNumber = await DescriptionOfWork.getLastOtherOfferingInstanceNumber();
    await DescriptionOfWork.setCurrentOtherOfferingInstanceNumber(lastInstanceNumber + 1);

    /**
     * if user manually deleted all instances on the summary page and 
     * clicked to `add instance`
     * 
     * 1 - Craft necessary DOWObject
     * 2 - set necessary setReturnToDOWSummary to ensure listing appears as expected
     *     on summary 
     */
    if (lastInstanceNumber === 1){
      DescriptionOfWork.addOfferingGroup(this.currentGroupId.toUpperCase());
      DescriptionOfWork.setAddGroupFromSummary(true);
      DescriptionOfWork.setReturnToDOWSummary(true);
      DescriptionOfWork.setFromAnticipatedUsersAndData(false);
    }
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
    this.offeringInstances.forEach(async (instance)=>{
      await saveOrUpdateOtherServiceOffering(instance, this.currentGroupId);
    })
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
    this.showSecurityNote = false;
    const allPeriods = await Periods.getAllPeriods();
    const classificationLevels = ClassificationRequirements.selectedClassificationLevels;
    this.offeringInstances = await DescriptionOfWork.getOtherOfferingInstances();
    
    this.offeringInstances.forEach(async (instance) => {
      const instanceClone = _.cloneDeep(instance);
      let instanceData: OtherServiceSummaryTableData = { instanceNumber: 1 };
      let isComplete = true;
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
          { title: "", value: "instanceNumber", width: "50" },
          { title: typeTitle, value: "typeOrTitle" },
          { title: "Classification", value: "classification" },
          { title: "Quantity", value: "qty" },
          { title: "vCPU", value: "vCPU" },
          { title: "Memory", value: "memory" },
          { title: "Storage", value: "storageAmount" },
          { title: "Performance", value: "performance" },
          { title: "", value: "actions", width: "75" },
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
          { title: "", value: "instanceNumber", width: "50" },
          { title: "Storage Type", value: "typeOrTitle", width: "50%" },
          { title: "Classification", value: "classification" },
          { title: "Storage Size", value: "storageAmount", width: "50%" },
          { title: "", value: "actions", width: "75" },
        ];
        typeOrTitle = instanceClone.storageType || "";
      // -----------------------------------------------------------------
      // TRAINING
      // -----------------------------------------------------------------
      } else if (this.isTraining) {
        this.tableHeaders = [    
          { title: "", value: "instanceNumber", width: "50" },
          { title: "Title", value: "typeOrTitle", width: "30%" },
          { title: "Classification", value: "classification", width: "20%" },
          { title: "Training format", value: "trainingType", width: "30%" },
          { title: "Duration", value: "duration", width: "20%"},
          { title: "", value: "actions", width: "75" },
        ];
        typeOrTitle = instanceClone.trainingRequirementTitle || "";

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
          { title: "", value: "instanceNumber", width: "50" },
          { title: "Statement of objectives", value: "typeOrTitle", width: "50%" },
          { title: "Classification", value: "classification" },
          { title: "On-site access", value: "personnelOnsiteAccess" },          
          { title: "Duration", value: "duration", width: "50%" },
          { title: "", value: "actions", width: "75" },
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

      isComplete = (await Summary.isOtherOfferingDataObjComplete(
        {
          otherOfferingData: instanceClone,
          id: (await DescriptionOfWork.getCurrentOfferingGroupId()),
          assessSecurityRequirements: false
        }
      )).isComplete as boolean;

      if (
        instanceClone.entireDuration === "NO" 
        && instanceClone.periodsNeeded.length 
        && allPeriods?.length
      ) {
        const periodsNeeded: string[] = [];
        instanceClone.periodsNeeded.forEach((sysId) => {
          const periodObj = allPeriods.find((obj) => obj.sys_id === sysId);
          if (periodObj) {
            const periodText = periodObj?.period_type.indexOf("BASE") > -1 
              ? "Base period" : "Option period " + (parseInt(periodObj.option_order) - 1);
            periodsNeeded.push(periodText);
          }
        });
        duration = periodsNeeded.join(", ");
      } else if (instanceClone.entireDuration === "YES") {
        duration = "Entire task order";
      }

      if (classificationLevels.length > 1) {
        const classificationObj = classificationLevels.find(obj => {
          const classificationLevelSysId = typeof obj.classification_level === "object"
            ? (obj.classification_level as ReferenceColumn).value  
            : obj.classification_level;
          return classificationLevelSysId === instanceClone.classificationLevel
        });

        if (classificationObj) {
          classificationLevel = buildClassificationLabel(classificationObj, "short");
          if ((this.isAdvisoryAssistance ||
              this.isHelpDesk ||
              this.isTraining ||
              this.isDocumentation ||
              this.isGeneralCloudSupport) &&
              (classificationLevel === "Top Secret" ||
              classificationLevel === "Secret/IL6")) {
            this.showSecurityNote = true;
          }
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
        sysId: instanceClone.sysId,
        isComplete
      };

      this.tableData.push(instanceData);
    })

    // ensure sorted by instance number
    this.tableData.sort((a, b) => a.instanceNumber > b.instanceNumber ? 1 : -1);    
  }

  public async loadOnEnter(): Promise<void> {
    this.returnToDOWSummary = await DescriptionOfWork.getReturnToDOWSummary();
    this.serviceGroupVerbiageInfo = await DescriptionOfWork.getServiceGroupVerbiageInfo();

    this.currentGroupId = await (await DescriptionOfWork.getCurrentOfferingGroupId()).toLowerCase();
    const offering = this.currentGroupId.toLowerCase();
    this.isCompute = offering === "compute";
    this.isGeneralXaaS = offering === "general_xaas"; 
    this.isDatabase = offering === "database";
    this.isStorage = offering === "storage";
    this.isTraining = offering === "training";
    this.isAdvisoryAssistance = offering === "advisory_assistance";
    this.isHelpDesk = offering === "help_desk_services";
    this.isDocumentation = offering === "documentation_support";
    this.isGeneralCloudSupport = offering === "general_cloud_support";
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

  protected async saveOnLeave(): Promise<boolean> {
    await DescriptionOfWork.setNeedsSecurityRequirements();
    return true;
  }

}
export default toNative(OtherOfferingSummary)

 
</script>
