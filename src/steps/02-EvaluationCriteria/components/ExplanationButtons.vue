<template>
  <div class="d-flex justify-start">

    <v-btn
      id="ChangeToCustomExplanationButton"
      v-if="showChangeToCustomButton"
      class="secondary font-size-14 px-4 mb-1 mt-1"
      @click="changeToCustomExplanation"
    >
      <ATATSVGIcon
        id="ChangeToCustomExplanationIcon"
        width="19"
        height="15"
        name="SwapVertical"
        class="mr-1"
        color="primary"
      />
      Change to custom explanation
    </v-btn>

    <v-btn
      id="ChangeToDAPPSSuggestionButton"
      v-if="showChangeToDAPPSButton"
      class="secondary font-size-14 px-4 mb-1 mt-1"
      @click="changeToDAPPSSuggestion"
    >
      <ATATSVGIcon
        id="changeToDAPPSSuggestionIcon"
        width="19"
        height="15"
        name="SwapVertical"
        class="mr-1"
        color="primary"
      />
      Change to DAPPS suggestion
    </v-btn>

    <v-btn
      id="RestoreSuggestionButton"
      v-if="showRestoreSuggestionButton"
      class="secondary font-size-14 px-4 mb-1 mt-1"
      :class="{'ml-5' : restoreButtonNeedsMargin}"
      :disabled="isRestoreDisabled"
      @click="confirmRestoreDefaultText"
    >
      <ATATSVGIcon
        id="RestoreSuggestionButtonIcon"
        width="19"
        height="15"
        name="restore"
        class="mr-1"
        :color="btnRestoreIconColor"
      />
      Restore default suggestion
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  }
})

export default class ExplanationButtons extends Vue {
  @Prop({ default: false }) private showChangeToCustomButton!: boolean;
  @Prop({ default: false }) private showChangeToDAPPSButton!: boolean;
  @Prop({ default: false }) private showRestoreSuggestionButton!: boolean;
  @Prop({ default: false }) private isRestoreDisabled!: boolean;
  @Prop({ default: false }) private restoreButtonNeedsMargin!: boolean;
  @Prop({ default: "primary" }) private btnRestoreIconColor!: string;
 
  public changeToCustomExplanation(): void {
    this.$emit("changeToCustomExplanation");
  }
  public changeToDAPPSSuggestion(): void {
    this.$emit("changeToDAPPSSuggestion");
  }
  public confirmRestoreDefaultText(): void {
    this.$emit("confirmRestoreDefaultText");
  }
}

</script>
