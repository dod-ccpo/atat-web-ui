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
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
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
    const storeData = await AcquisitionPackage.estimatedTaskOrderValue;
    if (storeData) {
      this.costEstimate = storeData || "";
    }
    const estimatedTaskOrderValue = AcquisitionPackage.estimatedTaskOrderValue;
    this.savedData.estimatedTaskOrderValue = estimatedTaskOrderValue || "";

  };

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.hasChanged()) {
        AcquisitionPackage.
          setEstimatedTaskOrderValue(this.currentData.estimatedTaskOrderValue || "");
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
