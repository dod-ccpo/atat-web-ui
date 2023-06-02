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

        <div id="SummaryItems">
            <div 
              class="container-max-width"
              :id="getIdText(summaryItem.title) + '_Wrapper'"
              v-for="(item, index) in summaryItems"
              :key="index">
              <div class=" d-flex justify-space-between">
                <div>
                  <h3 class="mb-1" :id="getIdText(item.title) + '_Heading'">
                    {{ item.title }}
                  </h3>
                  <p 
                    class="mb-0 _selectedOfferings" 
                    v-html="item.description"
                  >
                  </p>
                </div>
                <div class="d-flex align-start">
                  <div class="d-flex align-center">
                    <div 
                      v-if="isIncomplete(item)" 
                      class="d-flex align-start nowrap ml-5"
                    >
                      <v-icon
                        class="icon-20 text-warning-dark2 pr-2"
                      >warning</v-icon>
                      <p class="_missing-info mb-0 pr-4 _semibold">Missing info</p>
                    </div>
                    <v-btn
                      width="111"
                      :id="getIdText('MissingInfo_' + item.title)"
                      :class="[
                        isIncomplete(item)? 'primary': 'secondary',
                      ]"
                    >
                    <!-- @click="routeToSelection(item.serviceOfferingGroupId,false)"
                    @keydown.enter="routeToSelection(item.serviceOfferingGroupId,false)"
                    @keydown.space="routeToSelection(item.serviceOfferingGroupId,false)" -->
                      {{ isIncomplete(item)? 'Review': 'View/Edit' }}
                    </v-btn>
                  </div>  
                </div>
              </div>
              <hr v-if="index<summaryItems.length-1" />
          </div>
          </div>
          <component :is="componentToValidate"></component>
      </v-col>
    </v-row>
   
  </v-container>
</template>

<script lang="ts">
/* eslint camelcase: 0, prefer-const: 1 */
import { Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";
import { SummaryItem } from "types/Global";
import { getIdText } from "@/helpers";
import {Component as VueComponent} from "vue";
import PeriodOfPerformance from "./PeriodOfPerformance.vue";
import { SummaryStore } from "@/store/summary";
import Vue from "vue";
import Summary from "../Summary.vue";

@Component({
  components: {
    PeriodOfPerformance
  },
})
export default class SummaryStepFour extends Vue{

  public steps: VueComponent[] = [
    PeriodOfPerformance
  ]
  public componentToValidate: VueComponent = {};
  
  public isPopValid = true;
  public summaryItems: SummaryItem[] = [];
  public summaryItem: SummaryItem = {
    title: "",
    description: "",
    isComplete: false,
    isTouched: false,
    routeName: "",
    step: 0,
    substep: 0
  }

  public getIdText(id: string): string{
    return getIdText(id);
  }

  public isIncomplete(summaryItem: SummaryItem): boolean {
    return !summaryItem.isComplete && summaryItem.isTouched;
  }


  public async mounted():Promise<void> {
    // debugger;
    // const step: Vue = this.$refs.POP;
    debugger;
    // this.componentToValidate = PeriodOfPerformance;
    // const isValid = this.$root.$emit('validatePOP',
    //   (summaryItem: SummaryItem)=>{
    //     this.summaryItems.push(summaryItem)
    //     debugger;
    //   });

    this.steps.forEach(
      async (step) => {
        this.componentToValidate = await step;
        debugger;
       
      }, this
    )
    // debugger;
    // this.summaryItems = SummaryStore.summaryItems.find(
    //   (si) => si
    // )
  } 
}
</script>
