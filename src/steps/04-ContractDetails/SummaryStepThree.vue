<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Contract Details Summary
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            You are all done with this section, but you can come back at any time to edit 
            details. When you are ready, we will move on to your performance requirements.
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
import Summary from "@/store/summary";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATSummaryItems
  },
})
export default class SummaryStepThree extends Mixins(SaveOnLeave){
  public summaryItems: SummaryItem[] = [];
  
  public async mounted():Promise<void> {  
    await Summary.validateStepThree();
    this.summaryItems = await Summary.summaryItems
  }

  protected async saveOnLeave(): Promise<boolean> {
    return true;
  }
}
</script>
