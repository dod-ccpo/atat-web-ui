<template>
  <div class=" _feedback-form">
    <div class="flex-column">
      <div class="_feedback-tab" :class="{'_open':open}">
        <v-btn
        rounded
        @click="toggle()"
        @keydown.enter="toggle()"
        @keydown.space="toggle()"
        :class="{'_open':open}"
        >
          <span class="text-base">
            Customer Feedback
          </span>
          <ATATSVGIcon
            name="chevronDown"
            color="base"
            class=" _toggle mx-2"
            :class="{'_open':open}"
            width="10"
            height="6"
          />
        </v-btn>
      </div>
      <div class="_feedback-body">
        <v-expand-transition>
          <div>
            <h3 class="text-base-dark font-weight-500 mb-4">How was your experience with DAPPS?</h3>
            <div class="d-flex flex-row justify-space-between">
              <div class="mx-1">
                <v-btn
                  id="veryDissatisfied"
                  icon
                >
                  <ATATSVGIcon
                    name="veryDissatisfied"
                    color="primary"
                    class="mx-1 _feedback-icon"
                    width="60"
                    height="60"
                  />
                </v-btn>
              </div>
              <div class="mx-1">
                <v-btn
                  id="dissatisfied"
                  icon
                >
                  <ATATSVGIcon
                    name="dissatisfied"
                    color="primary"
                    class="ml-1 _feedback-icon"
                    width="60"
                    height="60"
                  />
                </v-btn>
              </div>
              <div class="mx-1">
                <v-btn
                  id="neutral"
                  icon
                >
                  <ATATSVGIcon
                    name="neutral"
                    color="primary"
                    class="ml-1 _feedback-icon"
                    width="60"
                    height="60"
                  />
                </v-btn>
              </div>
              <div class="mx-1">
                <v-btn
                  id="satisfied"
                  icon
                >
                  <ATATSVGIcon
                    name="satisfied"
                    color="primary"
                    class="ml-1 _feedback-icon"
                    width="60"
                    height="60"
                  />
                </v-btn>
              </div>
              <div class="mx-1">
                <v-btn
                  id="verySatisfied"
                  icon
                >
                  <ATATSVGIcon
                    name="verySatisfied"
                    color="primary"
                    class="ml-1 _feedback-icon"
                    width="60"
                    height="60"
                  />
                </v-btn>
              </div>
            </div>
          </div>
        </v-expand-transition>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import acquisitionPackage from "@/store/acquisitionPackage";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATSVGIcon
  }
})

export default class ATATFeedbackForm extends Vue {
  // eslint-disable-next-line max-len
  @PropSync("selectedFeedbackOptions") private _selectedFeedbackOptions!: string[];
  @PropSync("otherFeedbackValue") private _otherFeedbackValue!: string;

  private open = true
  private showForm = false
  public toggle():void{
    this.open = !this.open
  }

  private async loadOnEnter(): Promise<void> {
    const checkboxItems = [];
    const feedbackOptions = AcquisitionPackage.feedbackOptions
    console.log(feedbackOptions)
  }
  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
