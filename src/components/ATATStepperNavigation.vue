<template>
  <v-container fluid class="container-max-width mx-auto">
    <v-row>
      <v-col>

        <nav class="stepper-nav" :id="id">
          <hr class="base-lighter mt-10 mb-8" />
          <div class="d-flex" style="margin-bottom: 100px">

            <v-btn
              v-if="!noPrevious"
              @click="$emit('previous')"
              role="link"
              class="link-button no-border"
              id="BackButton"
            >
              <v-icon size="20">mdi-chevron-left</v-icon>
              <span>{{ backButtonText }}</span>
            </v-btn>

            <span class="ml-auto d-flex">
              <span v-if="additionalButtons.length && !hideAdditionalButtons" class="d-flex">
                <v-btn 
                  v-for="button in additionalButtons"
                  :key="button.buttonId"
                  @click="$emit('additionalButtonClick', button)" 
                  role="link" 
                  class="ml-4"
                  :id="button.buttonId"
                  :class="[{ 'd-none': button.hide }, getButtonClass(button)]"
                >
                  {{ button.buttonText }}
                </v-btn>
              </span>

              <v-btn 
                @click="continueClicked()" 
                v-if="!hideContinueButton"
                variant="flat" 
                :class="getContinueButtonColor"
                role="link" 
                class="ml-4"
                id="ContinueButton"
                :disabled="disableContinue"
              >
                {{ continueButtonText }}
              </v-btn>
            </span>
          </div>
        </nav>

      </v-col>
    </v-row>
  </v-container>

</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { AdditionalButton } from "@/store/steps/types";

@Component({
  emits:["next", "additionalButtonClick", "takeAltContinueAction", "previous"]
})
class ATATStepperNavigation extends Vue {
  @Prop({ default: () => []}) private additionalButtons!: Array<AdditionalButton>;
  @Prop({ default: "Back" }) private backButtonText?: string;
  @Prop({ default: "Continue" }) private continueButtonText?: string;
  @Prop({ default: false }) private noPrevious?: boolean;
  @Prop({ default: "stepperNavigation" }) private id?: string;
  @Prop({ default: false }) private hideContinueButton?: boolean;
  @Prop({ default: false }) private hideAdditionalButtons?: boolean;
  @Prop({ default: false }) private disableContinue!: boolean;
  @Prop({ default: "" }) private continueButtonColor?: string;
  @Prop({ default: "" }) private altContinueAction?: string;

  private getButtonClass(button: AdditionalButton) {
    return button.buttonClass ?? "_secondary";
  }

  get getContinueButtonColor():string{
    return this.continueButtonColor !== ""
      ? this.continueButtonColor as string
      : this.continueButtonText === 'Continue'? '_primary' : '_secondary'
  } 

  private continueClicked(): void {
    if (!this.altContinueAction) {
      this.$emit("next");
    } else {
      this.$emit("takeAltContinueAction");
    }
  }
}
export default toNative(ATATStepperNavigation)
</script>
