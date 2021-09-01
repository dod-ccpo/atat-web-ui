<template>
  <summary-card
    :title="applicationData.name"
    :items="applicationData.environments"
    :editPlace="editPlace"
  >
    <template slot="summary-description">
      <p class="body-lg width-80 word-break-normal">
        unclassified application to help track internal tasks
      </p>
    </template>

    <template slot="summary-body">
      <div
        class="
          text--base
          font-weight-bold
          mt-0
          d-flex
          justify-start
          black--text
        "
      >
        <div>ENVIRONMENTS</div>
      </div>
      <div class="body-lg d-flex justify-start black--text grouped-items">
        <div class="mx-3">Development</div>
      </div>
      <div class="body-lg d-flex justify-start black--text grouped-items">
        <div class="mx-3">Testing</div>
      </div>
      <div class="body-lg d-flex justify-start black--text grouped-items">
        <div class="mx-3">Staging</div>
      </div>
      <div class="body-lg d-flex justify-start black--text grouped-items">
        <div class="mx-3">Production</div>
      </div>
    </template>
  </summary-card>
</template>

<script lang="ts">
import Component from "vue-class-component";
import SummaryCard from "./SummaryCard.vue";
import { Prop } from "vue-property-decorator";
import { Application } from "../../../../types/Portfolios";

@Component({})
export default class ApplicationsEnvironmentsSummaryCard extends SummaryCard {
  @Prop({ default: {}, required: true })
  private applicationData!: Application;
  public editPlace = "addapplication";
}
</script>
