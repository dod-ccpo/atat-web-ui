<template>
  <v-card class="" max-width="800" tile>
    <v-list dense class="px-6 py-0 no-hover">
      <v-list-item-group>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          tabindex="-1"
          class="pa-0 border-bottom"
        >
          <v-list-item-content class="w-100 py-6">
            <div class="d-flex w-100 justify-space-between">
              <div class="pr-4">
                <h3>{{ item.title }}</h3>
                <p class="body text--base-dark mb-0">{{ item.description }}</p>
              </div>
              <div class="d-flex align-center w-100">
                <div class="d-flex text-base-error-dark mr-6">
                  <v-icon
                    aria-hidden="true"
                    class="icon-24 text-base-error-dark mr-2"
                    >error</v-icon
                  >
                  <p class="body-lg font-weight-bold mb-0 nowrap">
                    Needs Review
                  </p>
                </div>
                <v-btn
                  @click="onReviewPortfolioItem(item.name)"
                  class="primary theme--light mb-0"
                  role="link"
                  :aria-label="'Review ' + item.title"
                >
                  Review
                </v-btn>
              </div>
            </div>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ValidationSummaryItem } from "../../../../../types/Wizard";

@Component({})
export default class PortfolioValidationSummary extends Vue {
  @Prop({ default: new Array<ValidationSummaryItem>() })
  items!: ValidationSummaryItem[];

  public onReviewPortfolioItem(componentName: string, item: number): void {
    //todo: route to component item for review
    this.$store.dispatch("wizard/validateStep", item);
    this.$store.dispatch("wizard/setArrivedFromStep5", true);
    this.$store.dispatch("wizard/setReturnToReview", true);

    if (item === 2 && this.$store.state.taskOrderModels.length > 0) {
      const step2Validity = {
        stepNumber: 2,
        valid: true,
      };
      this.$store.dispatch("wizard/updateStepModelValidity", step2Validity);
    }

    if (item === 3 && this.$store.state.applicationModels.length > 0) {
      const step3Validity = {
        stepNumber: 3,
        valid: true,
      };
      this.$store.dispatch("wizard/updateStepModelValidity", step3Validity);
    }
    this.$router.push({ name: componentName });
  }
}
</script>
