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
            <!-- EJY what if only selecting Compute? -->
          </p>

          <v-data-table
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="5"
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
    :showDialog="showDialog"
    :title="'Delete Instance #' + instanceNumberToDelete + '?'"
    no-click-animation
    okText="Delete instance"
    width="450"
    @ok="deleteInstance"
    @cancelClicked="showDialog = false"
  >
    <template #content>
      <p class="body">
        This instance will be removed from your compute requirements. Any details 
        about this instance will not be saved.
      </p>
    </template>
  </ATATDialog>

  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import DescriptionOfWork from "@/store/descriptionOfWork";
import ClassificationRequirements from "@/store/classificationRequirements";
import { ComputeData, ComputeInstanceTableData } from "../../../../types/Global";
import { buildClassificationLabel } from "@/helpers";


@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }
})

export default class ComputeRequirements extends Vue {
  public computeInstances: ComputeData[] = [];

  public tableHeaders = [
    { text: "", value: "instanceNumber", width: "50" },
    { text: "Type", value: "type" },
    { text: "Location", value: "location" },
    { text: "Quantity", value: "qty" },
    { text: "vCPU", value: "vCPU" },
    { text: "Memory", value: "memory" },
    { text: "Storage", value: "storage" },
    { text: "Classification", value: "classification" },
    { text: "Performance", value: "performance" },
    { text: "", value: "actions", width: "75" },
  ];

  public tableData: ComputeInstanceTableData[] = [];

  public nextOfferingGroupStr = "";
  public showDialog = false;
  public instanceNumberToDelete = 0;

  public goToComputeForm(): void {
    // route to ServiceOfferings
    this.$router.push({
      name: "pathResolver",
      params: {
        resolver: "OfferGroupOfferingsPathResolver",
        direction: "next"
      },
    }).catch(() => console.log("avoiding redundant navigation"));
  }

  // EJY need to route to Compute Requirements page from Summary page
  // EJY if have been to the summary page, 

  public async addComputeInstance(): Promise<void> {
    const lastInstanceNumber = await DescriptionOfWork.getLastComputeInstanceNumber();
    await DescriptionOfWork.setCurrentComputeInstanceNumber(lastInstanceNumber + 1);
    this.goToComputeForm();
  }

  public editInstance(item: ComputeInstanceTableData): void {
    DescriptionOfWork.setCurrentComputeInstanceNumber(item.instanceNumber);
    DescriptionOfWork.setCurrentOfferingGroupId("COMPUTE");
    this.goToComputeForm();
  }

  public confirmDeleteInstance(item: ComputeInstanceTableData): void {
    this.instanceNumberToDelete = item.instanceNumber;
    this.showDialog = true;
  }

  public async deleteInstance(): Promise<void> {
    await DescriptionOfWork.deleteComputeInstance(this.instanceNumberToDelete);
    await this.buildTableData();
    this.showDialog = false;
  }

  public async buildTableData(): Promise<void> {
    this.tableData = [];
    this.computeInstances = await DescriptionOfWork.getComputeInstances();
    this.computeInstances.forEach((instance) => {
      const otherRegionIndex = instance.deployedRegions.indexOf("OtherRegion");
      if (otherRegionIndex > -1) {
        instance.deployedRegions.splice(otherRegionIndex, 1);
        if (instance.deployedRegionsOther) {
          instance.deployedRegions.push(instance.deployedRegionsOther);
        }
      }
      const deployedRegions = instance.deployedRegions.join(", ");

      const performanceTier = instance.performanceTier.indexOf("Other") > -1
        ? instance.performanceTierOther
        : instance.performanceTier;

      const classificationLevels = ClassificationRequirements.selectedClassificationLevels;
      let classificationLevel = "";
      if (classificationLevels.length > 1) {
        const classificationObj = classificationLevels.find(
          obj => obj.sys_id === instance.classificationLevel
        );
        if (classificationObj) {
          classificationLevel = buildClassificationLabel(classificationObj, "short");
        }
      } else {
        this.tableHeaders = this.tableHeaders.filter(obj => obj.value !== "classification");
      }

      if (!instance.environmentType) {
        // eslint-disable-next-line max-len
        instance.environmentType = `<div class="text-error font-weight-500">Unknown</div><div class="d-flex align-center"><svg viewBox="0 0 18 18" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M9.83366 13.6641H10.3337V13.1641V11.4974V10.9974H9.83366H8.16699H7.66699V11.4974V13.1641V13.6641H8.16699H9.83366ZM9.83366 10.3307H10.3337V9.83073V4.83073V4.33073H9.83366H8.16699H7.66699V4.83073V9.83073V10.3307H8.16699H9.83366ZM1.16699 8.9974C1.16699 4.67354 4.67647 1.16406 9.00033 1.16406C13.3242 1.16406 16.8337 4.67354 16.8337 8.9974C16.8337 13.3213 13.3242 16.8307 9.00033 16.8307C4.67647 16.8307 1.16699 13.3213 1.16699 8.9974Z" fill="#c60634" stroke="#c60634"/></svg><span class="font-size-12 text-error d-inline-block ml-1">Missing info</span></div>`;
      }

      const instanceData: ComputeInstanceTableData = {
        instanceNumber: instance.instanceNumber,
        type: instance.environmentType,
        location: deployedRegions,
        qty: instance.numberOfInstancesNeeded,
        vCPU: instance.numberOfVCPUs,
        memory: instance.memory ? `${instance.memory} GB` : "",
        storage: instance.storageAmount ? `${instance.storageAmount} GB` : "" ,
        classification: classificationLevel,
        performance: performanceTier,
      };
      this.tableData.push(instanceData);
    })
    // ensure sorted by instance number
    this.tableData.sort((a, b) => a.instanceNumber > b.instanceNumber ? 1 : -1);    
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
