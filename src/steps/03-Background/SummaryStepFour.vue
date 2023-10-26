<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Background Summary
        </h1>
        <div class="copy-max-width">
          <p class="mb-10">
            {{ introParagraph }}
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
import { Component, Vue, toNative } from "vue-facing-decorator";
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
class SummaryStepFour extends Vue {
  public summaryItems: SummaryItem[] = [];
  public introParagraph = "";

  public setIntroParagraph():void {
    this.introParagraph =(isStepComplete(4))
      ? "You are all done with this section, but you can come back at any time to edit details. " +
        "When you are ready, we will move on to your contract details. "
      : "We need some more details for this section. You can add info now, or come back to "
      + "make edits at any time. When you are ready to wrap up this section, we will move "
      + "on to gather background information."
  }

  public async mounted():Promise<void> {
    this.setIntroParagraph()
    Summary.setHasCurrentStepBeenVisited(
      await isStepValidatedAndTouched(4)
    )
    this.summaryItems = await getSummaryItemsforStep(4);
    await Summary.toggleButtonColor(4);
  }

  protected async saveOnLeave(): Promise<boolean> {
    await Summary.toggleButtonColor(-1);
    return true;
  }
}

export default SummaryStepFour
</script>
