<template>
  <div>
    <div
      class="d-flex align-start px-6 pt-2 _requirement-card"
      :class="[{ 'bg-error-lighter': noMonthlyValue}]"
    >
      <div class="font-size-14 font-weight-700 pt-2">
        {{index}}
      </div>
      <div class="pl-4" style="width: 100%">
        <v-text-field
          id="HeaderTextField"
          dense
          class="_requirement-head my-1 "
          hide-details
          autocomplete="off"
          width="100%"
          v-model="title"
          @blur="saveTitle()"
        />
        <v-textarea
          class="_requirement-description pt-0"
          auto-grow
          rows="2"
          hide-details
          v-model="description"
          @blur="saveDescription()"

        />
        <ATATErrorValidation
          id="MonthlyValueMissing"
          class="atat-text-field-error"
          :errorMessages="['Enter your estimated monthly price for this requirement.']"
          v-if="noMonthlyValue"
        />
      </div>
      <ATATTextField
        :value.sync="_cardData.monthly_price"
        :isCurrency="true"
        :showErrorMessages="false"
        appendText="/month"
        width="160"
        @blur="checkMonthlyValue()"
        class="ml-auto pt-3 _requirement-currency"
        :class="[{ 'error--text': noMonthlyValue},]"
        />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { Checkbox } from "../../../../../types/Global";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
@Component({
  components:{
    ATATTextField,
    ATATErrorValidation
  }
})
export default class CardRequirement extends Vue {
  @PropSync("cardData") private _cardData!: Record<string, string>;
  @Prop() private index!: number;

  public title = ""
  public description = ""
  public noMonthlyValue = false

  public saveTitle(): void {
    if(this.title !== ""){
      // eslint-disable-next-line camelcase
      this._cardData.IGCE_title = this.title;
    }else{
      this.title = this._cardData.IGCE_title;
    }
  }
  public saveDescription(): void {
    if(this.description !== ""){
      // eslint-disable-next-line camelcase
      this._cardData.IGCE_description = this.description;
    }else{
      this.description = this._cardData.IGCE_description;
    }
  }

  public checkMonthlyValue(): void {
    this.noMonthlyValue = Number(this._cardData.monthly_price) < 1;
  }
  public async loadOnEnter(): Promise<void> {
    Vue.nextTick(() => {
      this.title = this._cardData.IGCE_title
      this.description = this._cardData.IGCE_description
    })
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }
}
</script>

