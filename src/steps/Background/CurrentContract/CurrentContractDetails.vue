
<template>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather some details about your current contract
          </h1>
          <div class="copy-max-width">
  
            <ATATTextField 
              label="Incumbent contractor name" 
              id="IncumbentContractorName" 
              class="_input-max-width mb-10" 
              :value.sync="incumbentContractorName"
            />

            <ATATTextField 
              label="Contract number" 
              id="ContractNumber" 
              class="_input-max-width mb-10" 
              :value.sync="contractNumber"
            />
            
            <ATATTextField 
              label="Task/Delivery order number" 
              id="TaskDeliveryOrderNumber" 
              class="_input-max-width mb-10" 
              :value.sync="taskDeliveryOrderNumber"
            />

            <ATATDatePicker id="Expiration" 
              label="Contract/Order expiration date"
              placeHolder="MM/DD/YYYY"
              :value.sync="contractOrderExpirationDate" 
              :rules="[
                $validators.required('Please enter a valid date'),
                $validators.isDateValid('Please enter a valid date')
              ]" />

          </div>
        </v-col>
      </v-row>
    </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";

import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import AcquisitionPackage from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractDetailsDTO } from "@/models/BackgroundDTOs";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATDatePicker,
    ATATTextField,
  },
})
export default class CurrentContractDetails extends Mixins(SaveOnLeave) {
  private incumbentContractorName = "";
  private contractNumber = "";
  private taskDeliveryOrderNumber = "";
  private contractOrderExpirationDate = "";

  private get currentData(): CurrentContractDetailsDTO {
    return {
      incumbent_contractor_name: this.incumbentContractorName,
      contract_number: this.contractNumber,
      task_delivery_order_number: this.taskDeliveryOrderNumber,
      contract_order_expiration_date: this.contractOrderExpirationDate,
    };
  }

  private storeData: CurrentContractDetailsDTO = { 
      incumbent_contractor_name: "",
      contract_number: "",
      task_delivery_order_number: "",
      contract_order_expiration_date: "",
  };


  public async mounted(): Promise<void> {
      await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    debugger;
    this.storeData = await AcquisitionPackage.loadCurrentContractDetails();
    if (this.storeData) {
      if (Object.prototype.hasOwnProperty.call(this.storeData, 'incumbent_contractor_name')) {
        this.incumbentContractorName = this.storeData.incumbent_contractor_name;
      }
      if (Object.prototype.hasOwnProperty.call(this.storeData, 'contract_number')) {
        this.contractNumber = this.storeData.contract_number;
      }
      if (Object.prototype.hasOwnProperty.call(this.storeData, 'task_delivery_order_number')) {
        this.taskDeliveryOrderNumber = this.storeData.task_delivery_order_number;
      }
      if (Object.prototype.hasOwnProperty.call(this.storeData, 'contract_order_expiration_date')) {
        this.contractOrderExpirationDate = this.storeData.contract_order_expiration_date;
      }
    } else {
      AcquisitionPackage.setCurrentContractDetails(this.currentData);
    }
  }

  private hasChanged(): boolean {
    debugger;
    return hasChanges(this.currentData, this.storeData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    debugger;
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveCurrentContractDetails(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }


}
</script>

