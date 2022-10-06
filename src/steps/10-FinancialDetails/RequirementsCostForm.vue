<template>
  <v-container fluid class="container-max-width mb-7">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header">
          Temporary Financial Details Page
        </h1>
        <ATATTextField
          class="_input-max-width"
          label="Requirements Cost Estimate"
          id="TemporaryCostField"
          :isCurrency="true"
          :value.sync="costEstimate"
          :alignRight="true"
          width="200"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import FinancialDetails from "@/store/financialDetails";
import { RequirementsCostEstimateDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";
import ATATAlert from "../../components/ATATAlert.vue";
import ATATTextField from "../../components/ATATTextField.vue";

@Component({
  components: {
    ATATAlert,
    ATATTextField,
  },
})
export default class RequirementsCostForm extends Mixins(SaveOnLeave) {
  private costEstimate = "";

  private get currentData(): RequirementsCostEstimateDTO {
    return {
      estimatedTaskOrderValue: this.costEstimate,
    };
  };

  private savedData: RequirementsCostEstimateDTO = {
    estimatedTaskOrderValue: "",
  };

  private hasChanged(): boolean {
    return hasChanges(this.currentData, this.savedData);
  };

  public async loadOnEnter(): Promise<void> {
    const estimatedTaskOrderValue = 
      await FinancialDetails.getEstimatedTaskOrderValue();
    if (estimatedTaskOrderValue) {
      this.costEstimate = estimatedTaskOrderValue;
      this.savedData.estimatedTaskOrderValue = estimatedTaskOrderValue;
    }
  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        await FinancialDetails.
          saveEstimatedTaskOrderValue(this.currentData.estimatedTaskOrderValue || "");
      }
    } catch (error) {
      console.log(error);
    }

    return true;
  };
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };
};
</script>
