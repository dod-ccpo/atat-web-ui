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
          {{units}} 
        </span>
      </div>
    </div>
    <br/>
    <slot name="content"></slot>
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
  @Prop({default: "5 items"}) private units?: string;
  @Prop({default: "bg-base-lighter"}) private background?: string;
}
</script>

