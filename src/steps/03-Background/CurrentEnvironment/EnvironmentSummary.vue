
<template>
  <v-form class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col>
          <h1 class="page-header mb-3">
            Current Environment Summary
          </h1>
          <p id="IntroP">
            If you have more instances for this environment, add them below. You 
            can also edit or delete any information from the instances that you 
            have already entered. When you’re done, click Continue and we will 
            wrap up this section.
          </p>

          <v-data-table
            v-if="tableData.length"
            :headers="tableHeaders"
            :items="tableData"
            :items-per-page="-1"
            class="elevation-0 _instances-table mt-10"
            :hide-default-footer="true"
            no-data-text="You currently do not have any instances."
          >

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
            instance
          </v-btn>  


        </v-col>
      </v-row>
    </v-container>

    <ATATDialog
      id="DeleteInstanceModal"
      :showDialog="showDeleteInstanceDialog"
      :title="deleteInstanceModalTitle"
      no-click-animation
      okText="Delete instance"
      width="450"
      @ok="deleteInstance"
      @cancelClicked="showDeleteInstanceDialog = false"
    >
      <template #content>
        <p class="body">
          This instance will be removed from your environment summary. Any details
          about this instance will not be saved.
        </p>
      </template>
    </ATATDialog>

  </v-form>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Watch } from "vue-property-decorator";

import ATATDialog from "@/components/ATATDialog.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { CurrentEnvironmentInstanceDTO } from "@/api/models";
import { EnvInstanceSummaryTableData } from "types/Global";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";
import _ from "lodash";
import { routeNames } from "@/router/stepper";


@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }  
})
export default class EnvironmentSummary extends Vue {

  public deleteInstanceModalTitle = "";
  public envInstances: CurrentEnvironmentInstanceDTO[] = [];

  public tableHeaders: Record<string, string>[] = [];
  public tableData: EnvInstanceSummaryTableData[] = [];

  public showDeleteInstanceDialog = false;
  public instanceNumberToDelete = 0;

  public async addInstance(): Promise<void> {
    await CurrentEnvironment.resetCurrentEnvironmentInstance();
    this.navigate();
  }

  public navigate(): void {
    // navigate to instance form
    this.$router.push({
      name: routeNames.InstanceDetails,
      params: {
        direction: "next"
      }   
    });
  }

  public async editInstance(instance: EnvInstanceSummaryTableData): Promise<void> {
    debugger;
    await CurrentEnvironment.setCurrentEnvironmentInstanceSysId(instance.instanceSysId || "");
    this.navigate();
  }

  @Watch("confirmInstanceDelete")
  public confirmInstanceDeleteChanged(newVal: boolean): void {
    debugger;
    if (newVal && this.tableData.length > 0) {
      this.showDeleteInstanceDialog = newVal;
    } else if (newVal) {
      this.deleteInstance();
    }
  }

  public instanceToDeleteSysId = "";

  public confirmDeleteInstance(item: EnvInstanceSummaryTableData): void {
    debugger;
    this.instanceNumberToDelete = item.instanceNumber;
    this.deleteInstanceModalTitle = "Delete instance #" + this.instanceNumberToDelete + "?";
    this.showDeleteInstanceDialog = true;
    this.instanceToDeleteSysId = item.instanceSysId || "";
  }

  public async deleteInstance(): Promise<void> {
    debugger;
    await CurrentEnvironment.deleteEnvironmentInstance(this.instanceToDeleteSysId);
    await this.buildTableData();
    this.showDeleteInstanceDialog = false;
    this.instanceToDeleteSysId = "";
  }

  public async buildTableData(): Promise<void> {
    this.tableHeaders = [    
      { text: "", value: "instanceNumber", width: "50" },
      { text: "Location", value: "location" },
      { text: "Classification", value: "classification" },
      { text: "Quantity", value: "qty" },
      { text: "vCPU", value: "vCPU" },
      { text: "Memory", value: "memory" },
      { text: "Storage", value: "storage" },
      { text: "Performance", value: "performance" },
      { text: "", value: "actions", width: "75" },
    ];

    this.tableData = [];
    debugger;
    const instances = await CurrentEnvironment.getCurrentEnvironmentInstances();
    let instanceNumber = 1;
    instances.forEach(async (instance, index) => {
      const instanceClone = _.cloneDeep(instance);
      let isValid = true;
      let storage = "";
      if (instance.storage_type && instance.storage_amount && instance.storage_unit) {
        storage = instance.storage_type + ": " + String(instance.storage_amount)
          + " " + instance.storage_unit;
      }
      let instanceData: EnvInstanceSummaryTableData = { 
        instanceSysId: instance.sys_id,
        instanceNumber: index + 1,
        location: instance.instance_location || "",
        classification: "coming...",
        qty: instance.number_of_instances ? String(instance.number_of_instances) : "",
        vCPU: instance.number_of_VCPUs ? String(instance.number_of_VCPUs) : "",
        memory: instance.memory_amount ? String(instance.memory_amount) + " GB"  : "",
        storage,
        performance: instance.performance_tier
      };
      this.tableData.push(instanceData)
      instanceNumber++;
    })

    // 
  }

  public async loadOnEnter(): Promise<void> {
    //
    this.buildTableData();
    debugger;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>

