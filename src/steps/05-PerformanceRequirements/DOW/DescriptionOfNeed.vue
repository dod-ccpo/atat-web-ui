<template>
  <ATATTextArea
    :value.sync="_anticipatedNeedUsage"
    :id="'AnticipatedNeedUsage_' + (index + 1)"
    ref="DescriptionOfNeed"
    :label="'Describe the anticipated need and usage of this ' + requirementOrInstance"
    class="width-100 mb-10 max-width-740"
    :rows="5"
    maxChars="500"
    :rules="[
      $validators.required('Please provide a description for this ' + requirementOrInstance + '.'),
      $validators.maxLength('500', 'Description is to be 500 characters or less.')
    ]"
  />
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  }
})

export default class DescriptionOfNeed extends Vue {
  @PropSync("anticipatedNeedUsage") public _anticipatedNeedUsage!: string;
  @Prop() public index!: number;
  @Prop({ default: "requirement" }) public requirementOrInstance?: string;
}

</script>
