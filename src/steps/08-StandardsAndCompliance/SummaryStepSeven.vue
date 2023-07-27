<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Standards and Compliance Summary
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
           {{ headline }}
          </p>
        </div>

        <ATATSummaryItems
          :summaryItems = summaryItems>
        </ATATSummaryItems>
      </v-col>
    </v-row>
   
  </v-container>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, Mixins} from "vue-property-decorator";
import { SummaryItem } from "types/Global";
import ATATSummaryItems from "@/components/ATATSummaryItem.vue";
import Vue from "vue";
import Summary, { getSummaryItemsforStep, isStepComplete } from "@/store/summary";
import SaveOnLeave from "@/mixins/saveOnLeave";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSummaryItems
  },
})
export default class SummaryStepSeven extends Mixins(SaveOnLeave){
  public summaryItems: SummaryItem[] = [];

  get headline():string{
    return (isStepComplete(7))
      ? "You are all done with this section, but you can come back at any time to edit "
        + "details. When you are ready, we will move on to your financial details."
      : "We need some more details for this section. You can add info now, or come back "
        + "to make edits at any time. When you are ready to wrap up this section, we will move "
        + "on your financial details."
  }

  public async mounted(): Promise<void>{
    await Summary.validateStepSeven();
    this.summaryItems = await getSummaryItemsforStep(7);
    await Summary.toggleButtonColor(7);
  }


  protected async saveOnLeave(): Promise<boolean> {
    await Summary.toggleButtonColor(-1);
    return true;
  }

}
</script>
