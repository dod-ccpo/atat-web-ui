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
              v-if="hasContractData"
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
                :class="[{'text-error font-weight-500': !item.is_valid}]">
                {{ item.incumbent_contractor_name }}
              </span>
              <div v-if="!item.is_valid" class="d-flex align-center nowrap">
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
              {{  formatContractDate(item.contract_order_start_date) }} - 
              {{  formatContractDate(item.contract_order_expiration_date) }} 
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
            <div 
              v-if="!hasContractData"
              class=
                "w-100 py-10 border1 border-rounded border-base-lighter text-center mb-10 mt-10" 
              >
              <h3>
                You have not added any past contracts yet.
              </h3>
              <div class="d-flex justify-center">
                <v-btn
                id="AddInstanceNoData"
                type="button"
                role="link" 
                class="primary _normal _small-text mt-5"
                :ripple="false"
                @click="addInstance()"
                >
                <ATATSVGIcon 
                    color="white"
                    height="17" 
                    width="18" 
                    name="control-point" 
                    class="mr-2"
                  />
                  Add a contract
                </v-btn>
              </div>  
            </div>
            <hr class="mt-0" v-if="dataSource.length" /> 

          <v-btn
            v-if="hasContractData"
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
            <span v-if="hasContractData">&nbsp;another&nbsp;</span> 
            contract
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
      okText="Delete contract"
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
import { Component, Mixins } from "vue-property-decorator";
import Vue from "vue";
import AcquisitionPackage, 
{initialCurrentContract} from "@/store/acquisitionPackage";
import CurrentContract from "./CurrentContract.vue";
import { CurrentContractDTO } from "@/api/models";
import { formatDate, getIdText } from "@/helpers";
import { routeNames } from "@/router/stepper";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDialog from "@/components/ATATDialog.vue";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATDialog,
    ATATSVGIcon
  }  
})
export default class ProcurementHistorySummary extends Mixins(SaveOnLeave) {

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
  public instanceToDelete: CurrentContractDTO = {};
  public dataSource:CurrentContractDTO[] = [];

  public formatContractDate(dt: string){
    return dt !== "" ? formatDate(dt, "MMDDYYYY"): "";
  }

  get hasContractData(): boolean{
    return this.dataSource.length > 0
  }
  
  public confirmDeleteInstance(item: CurrentContractDTO): void {
    this.instanceNumberToDelete = item.instance_number as number;
    this.deleteInstanceModalTitle = 
      "Delete " + 
        (item.incumbent_contractor_name !== "" ? item.incumbent_contractor_name : "this contract")+ 
      "?";
    this.showDeleteInstanceDialog = true;
    this.instanceToDelete = item;
  }

  public async deleteInstance(): Promise<void> {
    await AcquisitionPackage.deleteContract(this.instanceToDelete);
    this.$nextTick(async () => {
      this.showDeleteInstanceDialog = false;
      this.instanceToDelete  = {};
      this.dataSource = this.dataSource.filter(
        ds => {
          return ds.instance_number !== this.instanceNumberToDelete
        }
      )
      await this.resetDataSource();
    })
  }

  
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    await this.setDataSource();
    await this.resetDataSource();
  }

  public async setDataSource():Promise<void>{
    this.dataSource = await AcquisitionPackage.currentContracts as CurrentContractDTO[];
  }

  public setHeaderId(column: string): string {
    return getIdText(column);
  }

  public async editInstance(contract: CurrentContractDTO): Promise<void> {

    await AcquisitionPackage.setCurrentContractInstanceNumber(
        contract.instance_number as number);
    await AcquisitionPackage.doSetCurrentContracts(this.dataSource);
    this.navigate();
  }

  public async addInstance(): Promise<void> {
    await this.initializeDataSource();
    this.navigate();
  }

  /**
   * initializes data source if data source is empty
   */
  public async initializeDataSource(): Promise<void>{
    if (!this.dataSource){ 
      await AcquisitionPackage.setCurrentContractInstanceNumber(0);
      this.dataSource=[];
      this.dataSource.push(initialCurrentContract())
    }
  }

  public async resetDataSource():Promise<void>{
    // sort
    await this.dataSource.sort();
    // reconfigure instance numbers
    await this.dataSource.forEach((c,idx)=> c.instance_number = idx)
    // set current contract instance number
    await AcquisitionPackage.setCurrentContractInstanceNumber(this.dataSource.length)
    // set current contracts instore
    await AcquisitionPackage.doSetCurrentContracts(this.dataSource);
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

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.dataSource.length > 0){
        await AcquisitionPackage.doSetCurrentContracts(this.dataSource);
        await AcquisitionPackage.updateCurrentContractsSNOW(this.dataSource)
      }
    } catch (error) {
      console.log(error);
    }
    return true;
  }

}
</script>
