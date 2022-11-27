<template>
  <v-card
    :class="background"
  >
    <div class="d-flex flex-row align-center pa-4">
      <div class="d-flex align-start">
        <ATATSVGIcon
          :name="iconType"
          width="24"
          height="34"
        ></ATATSVGIcon>
        &nbsp;&nbsp;
      </div>
      <div class="d-flex align-start">
        <h2>{{title}}</h2>
      </div>
      <div class="ml-auto">
        <span class="h3 text-base">
          {{items?.length}} 
          {{unitType}}<span v-if="items?.length > 1 || items?.length == 0">s</span>
        </span>
      </div>
    </div>
    <br/>
    <div>
      <v-btn
        @click="toggleBaseExpanded()"
      >
        <v-icon v-if="!baseExpanded">navigate_next</v-icon>
        <v-icon v-if="baseExpanded">expand_more</v-icon>
        <strong>Base Period</strong> (5 {{unitType}}s) 
      </v-btn>
      <div v-if="baseExpanded">
        <span class="pl-12">2 x Washington, DC, 2 days, 4 travelers</span>
        <div class="hr"></div>
      </div>
    </div>
    <div v-if="items?.length > 1">
      <div v-for="(item, idx) in items" :key="idx">
        <div v-if="idx != 0">
          <v-btn>
            <v-icon v-if="true">navigate_next</v-icon>
            <v-icon v-if="false">expand_more</v-icon>
            <strong>Option Period {{idx}}</strong> (5 {{unitType}}s) 
          </v-btn>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts">
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import ATATDivider from "@/components/ATATDivider.vue";

import { Component, Prop } from "vue-property-decorator";
@Component({
  components: {
    ATATSVGIcon,
    ATATDivider
  }
})
export default class CardRequirement extends Vue {
  @Prop({default: "Card Title"}) private title?: string;
  @Prop({default: "infoOutline"}) private iconType?: string;
  @Prop({default: "item"}) private unitType?: string;
  @Prop({default: "bg-base-lighter"}) private background?: string;
  @Prop({default: () => []}) private items?: [];

  private baseExpanded = false;

  private toggleBaseExpanded(): void {
    this.baseExpanded = !this.baseExpanded;
  }
}
</script>

