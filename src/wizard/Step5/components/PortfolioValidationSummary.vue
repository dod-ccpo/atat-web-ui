<template>
  <v-card class="" max-width="800" tile>
    <v-list dense>
      <v-list-item-group>
        <v-list-item v-for="(item, i) in items" :key="i">
          <v-list-item-content class="w-100">
            <div class="d-flex w-100 justify-space-between">
              <div>
                <h4 class="h4">{{ item.title }}</h4>
                <p class="body-lg">{{ item.description }}</p>
              </div>
              <div class="d-flex align-center w-100 mb-4">
                <div class="d-flex text-base-error-darker mr-6">
                  <v-icon class="icon-24 text-base-error-darker mr-2"
                    >error</v-icon
                  >
                  <p class="body-lg font-weight-bold mb-2">Needs Review</p>
                </div>
                <v-btn
                  @click="onReviewPortfolioItem(item.name)"
                  class="primary theme--light mb-2"
                  >Review</v-btn
                >
              </div>
            </div>
            <v-divider
              v-if="i < items.length - 1"
              :key="'divider_' + i"
            ></v-divider>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ValidationSummaryItem } from "../../../../types/Wizard";

@Component({})
export default class PortfolioValidationSummary extends Vue {
  @Prop({ default: new Array<ValidationSummaryItem>() })
  items!: ValidationSummaryItem[];

  public onReviewPortfolioItem(componentName: string): void {
    //todo: route to component item for review
    console.log(componentName);
  }
}
</script>
