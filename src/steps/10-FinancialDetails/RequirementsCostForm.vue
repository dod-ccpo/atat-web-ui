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
          :value="costEstimate"
          @update:value="costEstimate = $event"
          :alignRight="true"
          width="200"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import FinancialDetails from "@/store/financialDetails";
import { RequirementsCostEstimateDTO } from "@/api/models";
import { hasChanges } from "@/helpers";
import { From, SaveOnLeaveRefs, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
import ATATAlert from "../../components/ATATAlert.vue";
import ATATTextField from "../../components/ATATTextField.vue";

@Component({
  components: {
    ATATAlert,
    ATATTextField,
  },
})
class RequirementsCostForm extends Vue {

  $refs!: SaveOnLeaveRefs
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, form: this.$refs.form, nextTick: this.$nextTick,
    }).catch(() => false)
  }

  private costEstimate = "";

  private get currentData(): Pick<RequirementsCostEstimateDTO, 'estimatedTaskOrderValue'> {
    return {
      estimatedTaskOrderValue: this.costEstimate,
    };
  };

  private savedData: Pick<RequirementsCostEstimateDTO, 'estimatedTaskOrderValue'> = {
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
          saveEstimatedTaskOrderValue(this.currentData.estimatedTaskOrderValue ?? "");
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

export default toNative(RequirementsCostForm)
</script>
