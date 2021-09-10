<template>
  <div class="d-flex align-start">
    <v-card class="v-card ma-9 px-2 ml-0 body">
      <v-card-title>
        <div class="width-100 d-flex justify-space-between align-center">
          <h4 class="h4">{{ applicationData.name }}</h4>
          <v-btn
            class="py-0 px-2 primary--text"
            text
            small
            @click="onEdit()"
            :ripple="false"
            ><v-icon small class="icon-12 mr-2">edit</v-icon>
            <span class="link-body-md">Edit</span></v-btn
          >
        </div>
        <p class="body-lg width-80 word-break-normal">
          Unclassified application to help track internal tasks
        </p>
      </v-card-title>
      <v-card-text class="body-lg text--base-darkest">
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
      </v-card-text>
    </v-card>
  </div>
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

  public onEdit(): void {
    this.$router.push({
      name: "addapplication",
    });
  }
}
</script>
