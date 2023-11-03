<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Financial Details Summary
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
import { Component, Hook, Vue, toNative } from "vue-facing-decorator";
import { SummaryItem } from "types/Global";
import ATATSummaryItems from "@/components/ATATSummaryItem.vue";
import Summary, {
  getSummaryItemsforStep, 
  isStepValidatedAndComplete, 
  isStepValidatedAndTouched } from "@/store/summary";
import { From, SaveOnLeaveRefs, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";

@Component({
  components: {
    ATATSummaryItems
  },
})
class SummaryStepEight extends Vue {

  $refs!: SaveOnLeaveRefs
  
  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, form: this.$refs.form, nextTick: this.$nextTick,
    }).catch(() => false)
  }

  public summaryItems: SummaryItem[] = [];
  public introParagraph = "";
  
  public async setIntroParagraph():Promise<void> {
    this.introParagraph = (await isStepValidatedAndComplete(8))
      ? "You are all done with this section, but you can come back at any time to edit details. "
        + "When you are ready, we will generate documents to complete your acquisition package."
      : "We need some more details for this section. You can add info now, or come back to make "
        + "edits at any time. When you are ready to wrap up this section, we will generate  "
        + "documents to complete your acquisition package."
  }


  public async mounted(): Promise<void>{
    this.setIntroParagraph()
    Summary.setHasCurrentStepBeenVisited(
      await isStepValidatedAndTouched(8)
    )
    this.summaryItems = await getSummaryItemsforStep(8);
    await Summary.toggleButtonColor(8);
  }


  protected async saveOnLeave(): Promise<boolean> {
    await Summary.toggleButtonColor(-1);
    return true;
  }

}

export default toNative(SummaryStepEight)
</script>

<style scoped>

</style>
