
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
              :rules="[
                $validators.required('Please enter the incumbent contractor’s name.')
              ]"            
            />

            <ATATTextField 
              label="Contract number" 
              id="ContractNumber" 
              class="_input-max-width mb-10" 
              :value.sync="contractNumber"
              :rules="[
                $validators.required('Please enter your contract number.')
              ]"            
            />
            
            <ATATTextField 
              label="Task/Delivery order number" 
              id="TaskDeliveryOrderNumber" 
              class="_input-max-width mb-10" 
              :value.sync="taskDeliveryOrderNumber"
            />

            <!-- max date to be determined -->
            <ATATDatePicker id="Expiration" 
              label="Contract/Order expiration date"
              placeHolder="MM/DD/YYYY"
              :value.sync="contractOrderExpirationDate" 
              max="2024-01-01"
              :rules="[
                $validators.required('Please enter your contract/order expiration date.'),
                $validators.isDateValid('Please enter a valid date.')
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
import { CurrentContractDTO } from "@/api/models";
import { hasChanges } from "@/helpers";

@Component({
  components: {
    ATATDatePicker,
    ATATTextField,
  },
})

export default class CurrentContract extends Mixins(SaveOnLeave) {
  private incumbentContractorName 
    = AcquisitionPackage.currentContract?.incumbent_contractor_name || "";
  
  private contractNumber 
    = AcquisitionPackage.currentContract?.contract_number || "";
  
  private taskDeliveryOrderNumber 
    = AcquisitionPackage.currentContract?.task_delivery_order_number || "";
  
  private contractOrderExpirationDate 
    = AcquisitionPackage.currentContract?.contract_order_expiration_date || "";

  private get currentData(): CurrentContractDTO {
    return {
      incumbent_contractor_name: this.incumbentContractorName,
      contract_number: this.contractNumber,
      task_delivery_order_number: this.taskDeliveryOrderNumber,
      contract_order_expiration_date: this.contractOrderExpirationDate,
    };
  }

  private savedData = { 
    incumbent_contractor_name: "",
    contract_number: "",
    task_delivery_order_number: "",
    contract_order_expiration_date: "",
  } as Record<string, string>;

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData 
      = await AcquisitionPackage.loadCurrentContract() as Record<string, string>;

    if (storeData) {
      const keys: string[] = [
        "incumbent_contractor_name",
        "contract_number",
        "task_delivery_order_number",
        "contract_order_expiration_date"
      ];
      keys.forEach((key: string) => {
        if (Object.prototype.hasOwnProperty.call(storeData, key)) {
          this.savedData[key] = storeData[key];
        }
      });
    } else {
      AcquisitionPackage.setCurrentContract(this.currentData);
    }
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveCurrentContract(this.currentData);
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

}
</script>
