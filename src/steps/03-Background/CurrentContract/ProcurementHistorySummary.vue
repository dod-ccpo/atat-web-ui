<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Your Procurement History
          </h1>
          <div class="copy-max-width">
            <p class="mb-8">
              If you have more past contracts for this effort, add them below. 
              You can also edit or delete any information from the contracts that you have 
              already entered. When you’re done, click “Continue” and we will move on to your 
              current environment details.
            </p>
            <v-data-table
              id="ProcurementHistoryDataTable"
              :headers="tableHeaders"
              :items="dataSource"
              :disable-sort="true"
              :items-per-page="-1"
              hide-default-footer
              class="elevation-0 _instances-table mt-10"
              no-data-text="You have not added any past contracts yet."
            >
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.incumbent_contractor_name="{ item }">
              <span
                :class="[{'text-error font-weight-500': !item.isValid }]">
                {{ item.incumbent_contractor_name }}
              </span>
              <div v-if="!item.isValid" class="d-flex align-center nowrap">
                <ATATSVGIcon 
                  name="errorFilled"
                  width="13"
                  height="13"
                  color="error"
                />
                <span class="font-size-12 text-error d-inline-block ml-1">Missing info</span>
              </div>
            </template>

            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.contract_number="{ item }">
              {{ item.contract_number }}
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.task_delivery_order_number="{ item }">
              {{ item.task_delivery_order_number }}
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.contract_order_start_date="{ item }">
              {{  item.contract_order_start_date }} - 
              {{  item.contract_order_expiration_date }} 
            </template>
            <!-- eslint-disable vue/valid-v-slot -->
            <template v-slot:item.actions="{ item }">
              <button
                type="button"
                :id="'EditButton_' + item.instanceNumber"
                @click="editInstance(item)"
                class="mr-2"
              >
                <ATATSVGIcon name="edit" height="19" width="19" />
              </button>

              <button
                type="button"
                :id="'DeleteButton_' + item.instanceNumber"
                @click="confirmDeleteInstance(item)"
                class="ml-2"
              >
                <ATATSVGIcon name="remove" height="18" width="14" />
              </button>
            </template>
            </v-data-table>
            <hr class="mt-0" v-if="dataSource.length" /> 

          <v-btn
            v-if="dataSource.length>0"
            id="AddInstance"
            type="button"
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
            <span v-if="dataSource.length">&nbsp;another&nbsp;</span> 
            instance
          </v-btn>  

          </div>
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
          This contract will be removed from your procurement history. 
          Any contract details you added will not be saved.
        </p>
      </template>
    </ATATDialog>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component } from "vue-property-decorator";
import Vue from "vue";
import AcquisitionPackage, 
{initialCurrentContract} from "@/store/acquisitionPackage";
import CurrentContract from "./CurrentContract.vue";
import { CurrentContractDTO } from "@/api/models";
import { getIdText } from "@/helpers";
import { routeNames } from "@/router/stepper";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDialog from "@/components/ATATDialog.vue";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }  
})
export default class ProcurementHistorySummary extends Vue {

  public currentContractExists = "";
  public tableHeaders = [
    { text: "Contractor Name", value: "incumbent_contractor_name"},
    { text: "Contract Number",  value: "contract_number"},
    { text: "Task Order Number",  value: "task_delivery_order_number"},
    { text: "Period of Performance",  value: "contract_order_start_date"},
    { text: "", value: "actions", width: "75" },
  ];
  public instanceNumberToDelete = -1;
  public deleteInstanceModalTitle = "";
  public showDeleteInstanceDialog = false;
  public instanceToDeleteSysId = "";

  get dataSource():CurrentContractDTO[]{
    return AcquisitionPackage.currentContracts as CurrentContractDTO[];
  }
  
  public confirmDeleteInstance(item: CurrentContractDTO): void {
    this.instanceNumberToDelete = item.instance_number || -1;
    this.deleteInstanceModalTitle = "Delete " + item.incumbent_contractor_name + "?";
    this.showDeleteInstanceDialog = true;
    this.instanceToDeleteSysId = item.sys_id as string;
  }

  public async deleteInstance(): Promise<void> {
    await AcquisitionPackage.deleteContract(this.instanceToDeleteSysId);
    this.$nextTick(async () => {
      this.showDeleteInstanceDialog = false;
      this.instanceToDeleteSysId = "";
    })
  }

  public isRowValid(item:CurrentContractDTO): boolean{
    return item.incumbent_contractor_name !== ""
      && item.contract_number !== ""
      && item.task_delivery_order_number !== ""
      && item.contract_order_start_date !== ""
      && item.contract_order_expiration_date !== ""
  }

  
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    // debugger;
    // this.dataSource = await AcquisitionPackage.currentContracts as CurrentContractDTO[];
  }



  public setHeaderId(column: string): string {
    return getIdText(column);
  }

  public async editInstance(contract: CurrentContractDTO): Promise<void> {
    await AcquisitionPackage.setCurrentContractInstanceNumber(
        contract.instance_number as number);
    this.navigate();
  }

  public async addInstance(): Promise<void> {
    const newContract:CurrentContractDTO = initialCurrentContract();
    const newContactInstanceNumber = this.dataSource.length;
    await AcquisitionPackage.setCurrentContractInstanceNumber(
      newContactInstanceNumber
    )
    newContract.instance_number = newContactInstanceNumber;
    await AcquisitionPackage.setCurrentContract(newContract);
    this.navigate();
  }


  public navigate(): void {
    // navigate to instance form
    this.$router.push({
      name: routeNames.CurrentContractDetails,
      params: {
        direction: "next"
      }   
    });
  }
  

}
</script>
