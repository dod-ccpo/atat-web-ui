<template>
  <v-tooltip
    transition="slide-y-reverse-transition"
    :id="'Tooltip_' + id" 
    max-width="250px"
    :open-delay="500"
    top
    eager
    v-if="tooltipText"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        class=" pa-0 tooltip-button no-border"
        :class="buttonClass"
        :style="buttonStyle"
        icon
        :id="'TooltipButton_' + id" 
        x-small
        v-on="on"
        :ripple="false"
        :aria-label="'Help for ' + label"
        ><v-icon class="icon-20 ma-0 pa-0" small color="#544496"
          >help_outline
        </v-icon>
      </v-btn>
    </template>
    <div :id="'TooltipText_' + id" class="_tooltip-content-wrap">
      <span v-if="tooltipTitle" class="font-weight-bold d-block mb-1">
        {{ tooltipTitle }}
      </span>
      <div v-html="$sanitize(tooltipText)">
      </div>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATTooltip extends Vue {
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Label is missing" }) private label!: string;
  @Prop({ default: "" }) private buttonClass!: string;
  @Prop({ default: "" }) private buttonStyle!: string;
}

</script>
