<template>
  <v-form ref="form" lazy-validation>
    <v-container class="container-max-width" fluid>
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header">
            Let’s gather some details about your current contract
          </h1>
          <div class="copy-max-width">
            <IncumbentContractorName
              id="IncumbentContractorName"
              :rules="[
                $validators.required(
                  'Please enter the incumbent contractor’s name.'
                ),
              ]"
              :value.sync="incumbentContractorName"
              class="_input-max-width mb-10"
              label="Incumbent contractor name"
            />

            <ContractNumber
              id="ContractNumber"
              :rules="[
                $validators.required('Please enter your contract number.'),
              ]"
              :value.sync="contractNumber"
              class="_input-max-width mb-10"
              label="Contract number"
            />

            <TaskOrderNumber
                id="TaskDeliveryOrderNumber"
                :value.sync="taskDeliveryOrderNumber"
                :optional="true"
                class="_input-max-width mb-10"
                label="Task/Delivery order number"
                tooltipText="Leave this field empty if your previous acquisition
              was only a contract, not an order placed under a contract."
            />

            <!-- NOTE: max date to be determined -->
            <ATATDatePicker
              id="Expiration"
              :min="minDate"
              :rules="[
                $validators.required(
                  'Please enter your contract/order expiration date.'
                ),
                $validators.isDateValid('Please enter a valid date.'),
              ]"
              :value.sync="contractOrderExpirationDate"
              label="Contract/Order expiration date"
              max="2024-01-01"
              placeHolder="MM/DD/YYYY"
              tooltipText="Use the period of performance end date for your task order. If you
                  do not have a task order, use your contract end date."
            />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";

import ATATDatePicker from "@/components/ATATDatePicker.vue";
import ATATTextField from "@/components/ATATTextField.vue";
import ContractNumber from "@/steps/03-Background/components/ContractNumber.vue";
import IncumbentContractorName from "@/steps/03-Background/components/IncumbentContractorName.vue";
import AcquisitionPackage, { StoreProperties, } from "@/store/acquisitionPackage";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { CurrentContractDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import { add, format } from "date-fns";
import TaskOrderNumber from "@/steps/03-Background/components/TaskOrderNumber.vue";

@Component({
  components: {
    ATATDatePicker,
    ContractNumber,
    IncumbentContractorName,
    TaskOrderNumber,
    ATATTextField,
  },
})
export default class CurrentContract extends Mixins(SaveOnLeave) {
  private incumbentContractorName =
    AcquisitionPackage.currentContract?.incumbent_contractor_name || "";

  private contractNumber =
    AcquisitionPackage.currentContract?.contract_number || "";

  private taskDeliveryOrderNumber =
    AcquisitionPackage.currentContract?.task_delivery_order_number || "";

  private contractOrderExpirationDate =
    AcquisitionPackage.currentContract?.contract_order_expiration_date || "";

  private minDate: string = format(add(new Date(), {days: 1}), "yyyy-MM-dd");
  private savedData = {
    incumbent_contractor_name: "",
    contract_number: "",
    task_delivery_order_number: "",
    contract_order_expiration_date: "",
  } as Record<string, string>;

  private get currentData(): CurrentContractDTO {
    return {
      incumbent_contractor_name: this.incumbentContractorName,
      contract_number: this.contractNumber,
      task_delivery_order_number: this.taskDeliveryOrderNumber,
      contract_order_expiration_date: this.contractOrderExpirationDate,
    };
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = (await AcquisitionPackage.loadData<CurrentContractDTO>({
      storeProperty: StoreProperties.CurrentContract,
    })) as Record<string, string>;

    if (storeData) {
      const keys: string[] = [
        "incumbent_contractor_name",
        "contract_number",
        "task_delivery_order_number",
        "contract_order_expiration_date",
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

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await AcquisitionPackage.saveData<CurrentContractDTO>({
          data: this.currentData,
          storeProperty: StoreProperties.CurrentContract,
        });
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  }
}
</script>
