<template>
  <div>
    <div id="SummaryItems"
      v-for="(item, index) in summaryItems"
      :key="index">
      <div class="container-max-width" 
        :id="getIdText(item.title) + '_Wrapper'" 
      >
        <div class=" d-flex justify-space-between">
          <div>
            <h3 class="mb-1" 
            :id="getIdText(item.title) + '_Heading'">
              {{ item.title }}
            </h3>
            <p class="mb-0 _selectedOfferings" 
              v-html="item.description">
            </p>
          </div>
          <div class="d-flex align-start">
            <div class="d-flex align-center">
              <div 
                v-if="item.isTouched && !item.isComplete" 
                class="d-flex align-start nowrap ml-5">
                  <v-icon class="icon-20 text-warning-dark2 pr-2">warning</v-icon>
                  <p class="_missing-info mb-0 pr-4 _semibold">Missing info</p>
              </div>
              <v-btn width="111" 
                :id="getIdText('MissingInfo_' + item.title)" 
                :class="[
                  item.isComplete ? 'secondary' : 'primary',
                ]"
                @click="navigate(item.routeName)"
                @keydown.enter="navigate(item.routeName)"
                @keydown.space="navigate(item.routeName)">
                {{ getButtonText(item)  }}
              </v-btn>
            </div>
          </div>
        </div>
        <hr v-if="index < summaryItems.length - 1" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getIdText } from "@/helpers";
import { routeNames } from "@/router/stepper";
import { SummaryItem } from "types/Global";
import Vue from "vue";
import { Component, Prop} from "vue-property-decorator";

@Component({})
export default class ATATSummaryItem extends Vue {
  @Prop({default: "SummaryItems"}) private summaryItems!: SummaryItem[] | [];
  
  public getIdText(id: string): string{
    return getIdText(id);
  }

  public async navigate(routeName: string): Promise<void>{
    let dynamicKey = routeName as keyof unknown;
    this.$router.push({
      name: routeNames[dynamicKey],
      params: {
        direction: "next"
      },
    })
  }

  public getButtonText(item:SummaryItem):string{
    return !item.isTouched
      ? "Start"
      : item.isComplete ? 'View/Edit' : 'Review'
  }

}
</script>
