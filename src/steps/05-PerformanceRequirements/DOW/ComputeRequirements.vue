<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Your Compute Requirements
          </h1>
          <p>
            If you need more instances, add them below. You can also edit or delete 
            any info from the instances that you have already entered. When you’re 
            done, click Continue and we will move on to your 
            <span v-if="nextOfferingGroupStr">{{ nextOfferingGroupStr }}</span> 
            <span v-else>performance requirements</span>
            requirements.
          </p>

          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _compute-instances"
            :hide-default-footer="true"
            no-data-text="You do not have any requirements yet."
          >
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.type="{ item }">
              <span v-html="item.type"></span>
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <button
                @click="editInstance(item)"
                class="mr-2"
              >
                <ATATSVGIcon name="edit" height="19" width="19" />
              </button>

              <button
                @click="confirmDeleteInstance(item)"
                class="ml-2"
              >
                <ATATSVGIcon name="remove" height="18" width="14" />
              </button>
            </template>

          </v-data-table>  
          <hr class="mt-0" /> 
          <v-btn
            id="AddComputeInstance"
            role="link" 
            class="secondary _normal _small-text mt-5"
            :ripple="false"
            @click="addComputeInstance()"
          >
            <ATATSVGIcon 
              color="primary" 
              height="17" 
              width="18" 
              name="control-point" 
              class="mr-2"
            />
            Add <span v-if="tableData.length">another</span> instance
          </v-btn>  
        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      :showDialog="showDeleteInstanceDialog"
      :title="'Delete Instance #' + instanceNumberToDelete + '?'"
      no-click-animation
      okText="Delete instance"
      width="450"
      @ok="deleteInstance"
      @cancelClicked="showDeleteInstanceDialog = false"
    >
      <template #content>
        <p class="body">
          This instance will be removed from your compute requirements. Any details 
          about this instance will not be saved.
        </p>
      </template>
    </ATATDialog>

    <ATATDialog
      :showDialog="showDeleteComputeDialog"
      :title="'Delete all compute instances?'"
      no-click-animation
      okText="Delete compute"
      width="450"
      @ok="deleteCompute"
      @cancelClicked="cancelDeleteCompute"
    >
      <template #content>
        <p class="body">
          This action will remove the "Compute" category from your performance requirements.
          Any details about your instance<span v-if="tableData.length > 1">s</span> 
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

import DescriptionOfWork from "@/store/descriptionOfWork";
import ClassificationRequirements from "@/store/classificationRequirements";
import { OtherServiceOfferingData, ComputeInstanceTableData } from "../../../../types/Global";
import { buildClassificationLabel } from "@/helpers";
import _ from 'lodash';

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }
})

export default class ComputeRequirements extends Vue {
  public computeInstances: OtherServiceOfferingData[] = [];

  public tableHeaders = [
    { text: "", value: "instanceNumber", width: "50" },
    { text: "Type", value: "type" },
    { text: "Location", value: "location" },
    { text: "Classification", value: "classification" },
    { text: "Quantity", value: "qty" },
    { text: "vCPU", value: "vCPU" },
    { text: "Memory", value: "memory" },
    { text: "Storage", value: "storage" },
    { text: "Performance", value: "performance" },
    { text: "", value: "actions", width: "75" },
  ];

  public tableData: ComputeInstanceTableData[] = [];

  public nextOfferingGroupStr = "";
  public showDeleteInstanceDialog = false;
  public instanceNumberToDelete = 0;
  public showDeleteComputeDialog = false;
  public missingEnvironmentType = false;


  get confirmComputeDelete(): boolean {
    return DescriptionOfWork.confirmComputeDeleteVal;
  }

  @Watch("confirmComputeDelete")
  public confirmComputeDeleteChanged(newVal: boolean): void {
    if (newVal && this.tableData.length > 0) {
      this.showDeleteComputeDialog = newVal;
    } else if (newVal) {
      this.deleteCompute();
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

  public async addComputeInstance(): Promise<void> {
    const lastInstanceNumber = await DescriptionOfWork.getLastComputeInstanceNumber();
    await DescriptionOfWork.setCurrentComputeInstanceNumber(lastInstanceNumber + 1);
    this.navigate();
  }

  public editInstance(item: ComputeInstanceTableData): void {
    DescriptionOfWork.setCurrentComputeInstanceNumber(item.instanceNumber);
    DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
    this.navigate();
  }

  public confirmDeleteInstance(item: ComputeInstanceTableData): void {
    this.instanceNumberToDelete = item.instanceNumber;
    this.showDeleteInstanceDialog = true;
  }

  public async deleteInstance(): Promise<void> {
    await DescriptionOfWork.deleteComputeInstance(this.instanceNumberToDelete);
    await this.buildTableData();
    this.showDeleteInstanceDialog = false;
  }

  public async deleteCompute(): Promise<void> {
    await DescriptionOfWork.deleteCompute();
    DescriptionOfWork.setConfirmComputeDelete(false);
    this.navigate();
  }

  public cancelDeleteCompute(): void {
    this.showDeleteComputeDialog = false;
    DescriptionOfWork.setConfirmComputeDelete(false);
  }

  public async buildTableData(): Promise<void> {
    this.tableData = [];
    this.computeInstances = await DescriptionOfWork.getComputeInstances();
    this.computeInstances.forEach(async (instance) => {
      const instanceClone = _.cloneDeep(instance);

      const otherRegionIndex = instanceClone.deployedRegions.indexOf("OtherRegion");
      if (otherRegionIndex > -1) {
        instanceClone.deployedRegions.splice(otherRegionIndex, 1);
        if (instanceClone.deployedRegionsOther) {
          instanceClone.deployedRegions.push(instanceClone.deployedRegionsOther);
        }
      }
      const deployedRegions = instanceClone.deployedRegions.join(", ");

      const performanceTier = instanceClone.performanceTier.indexOf("Other") > -1
        ? instanceClone.performanceTierOther
        : instanceClone.performanceTier;

      const classificationLevels = ClassificationRequirements.selectedClassificationLevels;
      let classificationLevel = "";
      if (classificationLevels.length > 1) {
        const classificationObj = classificationLevels.find(
          obj => obj.sys_id === instanceClone.classificationLevel
        );
        if (classificationObj) {
          classificationLevel = buildClassificationLabel(classificationObj, "short");
        }
      } else {
        this.tableHeaders = this.tableHeaders.filter(obj => obj.value !== "classification");
      }

      if (!instanceClone.environmentType) {
        instanceClone.environmentType = `<div class="text-error font-weight-500">Unknown</div>`;
      }

      const isValid = await this.validateInstance(instanceClone);
      if (!isValid) {
        // eslint-disable-next-line max-len
        instanceClone.environmentType += `<div class="d-flex align-center"><svg viewBox="0 0 18 18" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M9.83366 13.6641H10.3337V13.1641V11.4974V10.9974H9.83366H8.16699H7.66699V11.4974V13.1641V13.6641H8.16699H9.83366ZM9.83366 10.3307H10.3337V9.83073V4.83073V4.33073H9.83366H8.16699H7.66699V4.83073V9.83073V10.3307H8.16699H9.83366ZM1.16699 8.9974C1.16699 4.67354 4.67647 1.16406 9.00033 1.16406C13.3242 1.16406 16.8337 4.67354 16.8337 8.9974C16.8337 13.3213 13.3242 16.8307 9.00033 16.8307C4.67647 16.8307 1.16699 13.3213 1.16699 8.9974Z" fill="#c60634" stroke="#c60634"/></svg><span class="font-size-12 text-error d-inline-block ml-1">Missing info</span></div>`;
      }
      const instanceData: ComputeInstanceTableData = {
        instanceNumber: instanceClone.instanceNumber,
        type: instanceClone.environmentType,
        location: deployedRegions,
        classification: classificationLevel,
        qty: instanceClone.numberOfInstancesNeeded,
        vCPU: instanceClone.numberOfVCPUs,
        memory: instanceClone.memory ? `${instanceClone.memory} GB` : "",
        storage: instanceClone.storageAmount ? `${instanceClone.storageAmount} GB` : "" ,
        performance: performanceTier,
      };
      this.tableData.push(instanceData);
    })
    // ensure sorted by instance number
    this.tableData.sort((a, b) => a.instanceNumber > b.instanceNumber ? 1 : -1);    
  }

  public async validateInstance(instance: OtherServiceOfferingData): Promise<boolean> {
    const instanceData: Record<string, any> = _.clone(instance);
    let isValid = true;
    const requiredFields = [
      "environmentType",
      "classificationLevel",
      "entireDuration",
      "memory",
      "anticipatedNeedUsage",
      "numberOfInstancesNeeded",
      "numberOfVCPUs",
      "operatingSystemAndLicensing",
      "performanceTier",
      "storageAmount",
      "storageType",
    ];
    requiredFields.forEach((field) => {
      if (instanceData[field] === "") {
        isValid = false;
      }
    });
    if (instanceData.performanceTier === "OtherPerformance" 
      && instanceData.performanceTierOther === ""
    ) {
      isValid = false;
    }

    if (instanceData.performanceTier === "OtherRegion" 
      && instanceData.deployedRegionsOther === ""
    ) {
      isValid = false;
    }

    return isValid;
  }

  public async loadOnEnter(): Promise<void> {
    await this.buildTableData();

    const DOWObject = DescriptionOfWork.DOWObject;
    if (DOWObject && DOWObject.length > 1) {
      const computeIndex = DOWObject.findIndex(
        obj => obj.serviceOfferingGroupId.toLowerCase() === "compute"
      );
      if (computeIndex < DOWObject.length - 1) {
        const nextOfferingGroupId = DOWObject[computeIndex + 1].serviceOfferingGroupId;
        const offeringGroups = DescriptionOfWork.serviceOfferingGroups;
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
