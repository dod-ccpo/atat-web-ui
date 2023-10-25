<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Acquisition Package Summary
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            {{ introParagraph }}
          </p>
        </div>

        <ATATSummaryItems
          :summaryItems = summaryItems
          @deleteAcor="deleteAcor"
        >
        </ATATSummaryItems>
      </v-col>
    </v-row>

  </v-container>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, toNative, Vue} from "vue-facing-decorator";
import { SummaryItem } from "types/Global";
import ATATSummaryItems from "@/components/ATATSummaryItem.vue";
import Summary, {
  getSummaryItemsforStep,
  isStepComplete,
  isStepValidatedAndTouched
} from "@/store/summary";
import SaveOnLeave from "@/mixins/saveOnLeave";
 

@Component({
  mixins: [SaveOnLeave],
  components: {
    ATATSummaryItems
  },
})
class SummaryStepOne extends Vue {
  public summaryItems: SummaryItem[] = [];
  public introParagraph = "";

  public setIntroParagraph():void {
    this.introParagraph = (isStepComplete(1))
      ? "You are all done with this section, but you can come back at any time to edit details. " +
      " When you are ready, we will move on to gathering your background."
      : "We need some more details for this section. You can add info now, or come back to make " +
      "edits at any time. When you are ready to wrap up this section, we will move on to " +
      "gathering your background."
  }

  public async mounted(): Promise<void>{
    this.setIntroParagraph()
    Summary.setHasCurrentStepBeenVisited(
      await isStepValidatedAndTouched(1)
    )
    this.summaryItems = await getSummaryItemsforStep(1);
    await Summary.toggleButtonColor(1);
  }
  public async deleteAcor(): Promise<void>{
    const existingACORSummaryItem = this.summaryItems.find(
      si => si.routeName.toUpperCase() === "ACORINFORMATION"
    )
    if (existingACORSummaryItem){
      Summary.removeSummaryItem(existingACORSummaryItem)
    }
  }

  protected async saveOnLeave(): Promise<boolean> {
    await Summary.toggleButtonColor(-1);
    return true;
  }

}
export default toNative(SummaryStepOne)
</script>
