<template>
  <div class=" _feedback-form">
    <div class="flex-column">
      <div class="_feedback-tab" :class="{'_open':open}">
        <v-btn
        rounded
        @click="toggle()"
        @keydown.enter="toggle()"
        @keydown.space="toggle()"
        >
          <span class="text-base">
            Customer Feedback
          </span>
          <ATATSVGIcon
            name="chevronDown"
            color="base"
            class=" _toggle ml-2"
            :class="{'_open':open}"
            width="16"
            height="16"
          />
        </v-btn>
      </div>
      <div class="_feedback-body">
        <h3 class="text-base-dark font-weight-500 mb-4">How was your experience with DAPPS?</h3>
        <div class="d-flex flex-row">
          <ATATSVGIcon
            name="veryDissatisfied"
            color="primary"
            class="ml-1"
            width="60"
            height="60"
          />
          <ATATSVGIcon
            name="dissatisfied"
            color="primary"
            class="ml-1"
            width="60"
            height="60"
          />
          <ATATSVGIcon
            name="neutral"
            color="primary"
            class="ml-1"
            width="60"
            height="60"
          />
          <ATATSVGIcon
            name="satisfied"
            color="primary"
            class="ml-1"
            width="60"
            height="60"
          />
          <ATATSVGIcon
          name="verySatisfied"
          color="primary"
          class="ml-1"
          width="60"
          height="60"
        />
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, PropSync } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

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
  public toggle():void{
    this.open = !this.open
  }
}
</script>
