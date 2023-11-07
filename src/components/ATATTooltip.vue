<template>
  <v-tooltip
    transition="fade-transition"
    :id="'Tooltip_' + id" 
    class="_atat-tooltip-wrapper"
    max-width="250px"
    :open-delay="500"
    location="top"
    :eager="true"
    v-if="tooltipText"
    offset="0"
  >
    <!--TODO: validate that this still works after removal of on from activator-->
    <template v-slot:activator="{ props }">
      <v-btn
        v-bind="props"
        class=" pa-0 _tooltip-button no-border"
        :class="buttonClass"
        :style="buttonStyle"
        icon
        :id="'TooltipButton_' + id" 
        size="x-small"
        :ripple="false"
        :aria-label="'Help for ' + label"
        ><v-icon class="icon-20 ma-0 pa-0" size="small" color="#544496"
          >mdi-help-circle-outline
        </v-icon>
      </v-btn>
    </template>
    <div :id="'TooltipText_' + id" class="_tooltip-content-wrap">
      <span v-if="tooltipTitle" class="font-weight-bold d-block mb-1">
        {{ tooltipTitle }}
      </span>
      <div v-html="tooltipText">
      </div>
    </div>
  </v-tooltip>
</template>

<script lang="ts">
import { Prop, Vue, Component, toNative } from "vue-facing-decorator";
@Component
class ATATTooltip extends Vue {
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: "Label is missing" }) private label!: string;
  @Prop({ default: "" }) private buttonClass!: string;
  @Prop({ default: "" }) private buttonStyle!: string;
}
export default toNative(ATATTooltip)
</script>
