<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col class="col-12">
        <h1 class="page-header mb-3">
          Your Evaluation Criteria Summary
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
import Summary, { getSummaryItemsforStep, isStepComplete } from "@/store/summary";
import { SaveOnLeaveRefs } from 'types/Global'
import { From, To, beforeRouteLeaveFunction } from "@/mixins/saveOnLeave";
 

@Component({
  components: {
    ATATSummaryItems
  },
})
class SummaryStepTwo extends Vue {

  @Hook
  public async beforeRouteLeave(to: To, from: From) {
    return await beforeRouteLeaveFunction({ to, from, 
      saveOnLeave: this.saveOnLeave, 
      form: this.$refs as SaveOnLeaveRefs, 
      nextTick: this.$nextTick,
    }).catch()
  }

  public summaryItems: SummaryItem[] = [];
  public introParagraph = "";

  public setIntroParagraph():void {
    this.introParagraph = (isStepComplete(2))
      ? "You are all done with this section, but you can come back at any time to edit details. " +
        " When you are ready, we will move on to gathering your background."
      : "We need some more details for this section. You can add info now, or come back to make " +
        "edits at any time. When you are ready to wrap up this section, we will move on to " +
        "gathering your background."
  }

  public async mounted(): Promise<void>{
    this.setIntroParagraph()
    await Summary.validateStepTwo();
    this.summaryItems = await getSummaryItemsforStep(2);
    await Summary.toggleButtonColor(2);
  }


  protected async saveOnLeave(): Promise<boolean> {
    await Summary.toggleButtonColor(-1);
    return true;
  }

}

export default toNative(SummaryStepTwo)
</script>
