<template>
  <fieldset class="no-border" >
    
    <template v-if="!isMultiple">
      <div class="d-flex align-center mb-2">
        <label class="form-field-label font-weight-400 mr-1">
          {{ singlePeriodLabel}} 
         </label>
      <ATATTooltip 
        v-if="!isMultiple && showSinglePeriodTooltip"
        :tooltipText="singlePeriodTooltipText"
      />
     
    </div>
      <ATATTextField
        id="SingleAmount"
        width="190"
        class="mr-2"
        :alignRight="true"
        :value.sync="_values[0]"
        :isCurrency="textboxSuffix === ''"
        :appendText="textboxSuffix !== '' ? textboxSuffix : null"
        :tooltipText="showSinglePeriodTooltip ? singlePeriodTooltipText : null"
        @blur="setsysIdArrayStringified(_values[0], 'PER_PERIOD')"
        :showErrorMessages="true"
        :rules="[
          $validators.required(
            singlePeriodErrorMessage,
          ),
        ]"
      />
    </template>
    <template v-if="isMultiple">
      <div class="d-flex align-center mb-4">
        <label class="form-field-label font-weight-500 mr-1">
          {{ multiplePeriodLabel}} 
        </label>
        <ATATTooltip 
          v-if="isMultiple && showMultiplePeriodTooltip"
          :tooltipText="multiplePeriodTooltipText"
        />
      </div>
      <div
        v-for="(period, idx) in periods"
        :key="idx"
        class="font-weight-500 font-size-14 text-base"
        :class="[
          idx < periods.length - 1 ? 'pb-5' : '',
          ' pl-2 d-flex align-start',
        ]"
        style="border-left: #544496 4px solid"
      >
        <div class="text-right mt-2" style="width: 75px">
          {{ getOption(idx) }}
        </div>
        <div>
          <ATATTextField
            :id="period.period_type + '_' + idx"
            width="190"
            class="ml-5"
            :alignRight="true"
            :value.sync="_values[idx]"
            @blur="setsysIdArrayStringified(_values[idx], period.sys_id)"
            :isCurrency="textboxSuffix === ''"
            :appendText="textboxSuffix !== '' ? textboxSuffix : null"
            :showErrorMessages="true"
            :rules="[
              $validators.required(
                multiplePeriodErrorMessage,
              ),
            ]"
          />
          <!-- todo change that back to :number -->
        </div>
      </div>
    </template>
  </fieldset>
</template>
<script lang="ts">
/*eslint prefer-const: 1 */
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATTooltip from "@/components/ATATTooltip.vue";
import { PeriodDTO } from "@/api/models";

@Component({
  components: {
    ATATTextField,
    ATATTooltip
  }
})
export default class ATATSingleAndMultiplePeriods extends Vue {
  @Prop({default: false}) private isMultiple?: boolean;
  @Prop({default: true}) private showSinglePeriodTooltip?: boolean;
  @Prop({default: false}) private showMultiplePeriodTooltip?: boolean;
  @Prop({default: "Estimated price per period"}) private singlePeriodLabel?: string;
  @Prop({default: "Estimated price per period"}) private multiplePeriodLabel?: string;
  @Prop({default: ''}) private textboxSuffix?: string;
  @Prop({default: "Default Single Textbox Tooltip"}) private singlePeriodTooltipText?: string;
  @Prop({default: "Default Multiple Textbox Tooltip"}) private multiplePeriodTooltipText?: string;
  @Prop(
    {default: "Enter your estimated price per period."}
  ) private singlePeriodErrorMessage?: string;
  @Prop(
    {default: "Enter your estimated price for this period."}
  ) private multiplePeriodErrorMessage?: string;
  @Prop() private periods!: PeriodDTO[];

  @PropSync("values", {default: () => []}) private _values!: string[];

  /** 
   * Returns [{periodSysId: value}] 
  */
  @PropSync("sysIdValueArray", {default: () => []}) 
    _sysIdValueArray!:Record<string, string>[];

  /**
   * @params - val: string
   *         - sysID to be added: string
   * 
   * 1. formats array to be stringified 
   * 2. sets this._sysIdValueArray and modifies array values as necessary
   * Sometimes necessary for the backend value
   * 
   * Sets this._sysIdValueArray
   */
  private setsysIdArrayStringified(val: string, sysId: string): void{
    if (!this.isMultiple){
      this._sysIdValueArray = [];
    }

    if (val && parseInt(val)>0 ){
      const existingKeyIndex = this._sysIdValueArray.findIndex(
        obj => Object.keys(obj)[0] === sysId);
      //eslint-disable-next-line prefer-const 
      let obj:Record<string, string>= {};
      obj[sysId] = val;
      
      existingKeyIndex>-1 
        ? this._sysIdValueArray[existingKeyIndex] = obj
        : this._sysIdValueArray.push(obj);
    }
  }

  @Watch("isMultiple")
  public isMultipleChanged(newValue: boolean): void {
    if (!newValue) {
      this._values.length = 1;
    }
  }
  public getOption(idx: number): string {
    return idx === 0 ? "Base" : "Option " + idx;
  }

}
</script>
