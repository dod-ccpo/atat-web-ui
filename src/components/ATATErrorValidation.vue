<template>
  <div 
    v-if="showError" 
    class="d-flex justify-start align-top atat-text-field-error"
    :class="textAreaWithCounter ? 'mt-n5' : 'mt-2'"  
  >
    <div><v-icon class="text-base-error icon-20 ma-1 mt-0">error</v-icon></div>
    <div class="field-error ml-2">{{errorMessages[0]}}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class ATATErrorValidation extends Vue {
  // props
  @Prop({ default: () => [] }) private errorMessages!: string[];
  @Prop({ default: false }) private textAreaWithCounter!: boolean;

  get showError(): boolean {
    return this.errorMessages.length > 0;
  }
}
</script>