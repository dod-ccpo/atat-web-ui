<template>
  <v-container>
    <v-row
      style="flex-wrap: nowrap;"
      class=" _requirement-card"
      :class="[{ 'bg-error-lighter': showErrors}]"
    >
      <v-col class="font-size-14 font-weight-700 pt-5 pl-6 pr-5 flex-grow-0 flex-shrink-0">
        {{index}}
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-1">
        <v-text-field
          :id="'HeaderTextField_' + index"
          dense
          class="_requirement-head my-1 width-100"
          hide-details
          autocomplete="off"
          width="100%"
          v-model="title"
          @blur="saveTitle()"
        />
        <v-textarea
          :id="'Description_' + index"
          class="_requirement-description pt-0 width-100"
          auto-grow
          rows="1"
          hide-details
          v-model="description"
          @blur="saveDescription()"

        />
        <ATATErrorValidation
          id="MonthlyValueMissing"
          class="atat-text-field-error"
          :errorMessages="['Enter your estimated monthly price for this requirement.']"
          v-if="showErrors"
        />
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-0">
        <ATATTextField
          :value.sync="estimate"
          :isCurrency="true"
          :showErrorMessages="false"
          :appendText=type
          width="220"
          :id="'EstimateTextField_' + index"
          @blur="checkMonthlyValue()"
          :alignRight="true"
          :rules="[
            $validators.required(''),
          ]"
          class="ml-auto pt-3 _requirement-currency"
          :class="[{ 'error--text': noMonthlyValue},]"
          @errorMessage="setErrorMessage"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { Component, Prop, PropSync, Watch} from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import { currencyStringToNumber, toCurrencyString } from "@/helpers";
import { IgceEstimateDTO } from "@/api/models";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";


@Component({
  components:{
    ATATTextField,
    ATATErrorValidation
  }
})
export default class CardRequirement extends Vue {

  @PropSync("cardData") private _cardData!: IgceEstimateDTO;
  @Prop() private index!: number;

  public title = ""
  public description = ""
  public type = ""
  public noMonthlyValue = false
  public estimate = "";
  public moneyNumber = 0;
  public errorMessage = "";

  public saveTitle(): void {
    if(this.title !== ""){
      // eslint-disable-next-line camelcase
      this._cardData.title = this.title;
    }else{
      this.title = this._cardData.title as string;
    }
  }
  public saveDescription(): void {
    if(this.description !== ""){
      // eslint-disable-next-line camelcase
      this._cardData.description = this.description;
      // eslint-disable-next-line camelcase
      this._cardData.updated_description = "YES";
    }else{
      this.description = this._cardData.description as string;
    }
  }

  public checkMonthlyValue(): void {
    // eslint-disable-next-line camelcase
    this._cardData.unit_price = currencyStringToNumber(this.estimate);
    if(this._cardData.unit_price !== null){
      this.noMonthlyValue = this._cardData.unit_price < 1;
    }
  }
  public async loadOnEnter(): Promise<void> {
    this.title = this._cardData.title as string
    this.description = this._cardData.description as string;
    this.type = "/" + this._cardData.unit?.toLowerCase()
    this.moneyNumber = this._cardData.unit_price || 0;
    this.estimate = this.moneyNumber > 0
      ? toCurrencyString(this.moneyNumber, true)
      : "" ;
  }

  public setErrorMessage(message: string): void{
    this.errorMessage = message;
  }

  get showErrors(): boolean {
    return this.noMonthlyValue || this.errorMessage.length>0 
  }

  @Watch("estimate")
  protected monthlyPriceChange(newVal: string): void {
    // eslint-disable-next-line camelcase
    this._cardData.unit_price =  currencyStringToNumber(newVal);
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter()
  }
}
</script>
