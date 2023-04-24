<template>
  <div v-if="showError">
    <div
      v-for="(em, idx) in _errorMsgs"
      :key="idx"
      class="d-flex justify-start align-top atat-text-field-error"
      :class="textAreaWithCounter ? 'mt-n5' : 'mt-2'"
    >
      <div>
        <v-icon class="text-base-error icon-20 ma-1 mt-0" color="error">error</v-icon>
      </div>
      <div class="field-error ml-2 text-left" v-html="errorMessages[idx]"></div>
    </div>
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
  @Prop({ default: false }) private showAllErrors!: boolean;
  @Prop({default: "Error"}) private id?: string;

  private _errorMsgs = ['']; 

  get showError(): boolean {
    if (!this.showAllErrors){
      this._errorMsgs = this.errorMessages.length>0 ? [this.errorMessages[0]] : [];
    } else {
      this._errorMsgs = this.errorMessages;
    }
    return this._errorMsgs?.length > 0;
  }
}
</script>
