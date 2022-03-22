<template>
  <div 
    :id="id+'_radio_group_control'" >
    <v-radio-group
      ref="radioButtonGroup"
      :hide-details="false"
      :rules="rules"
      v-model="_selectedValue"
    >
      <fieldset>
        <legend
          v-if="legend"
          class="form-field-label mb-3 pb-0"
          :class="{ 'd-sr-only': legendSrOnly }"
        >
          {{ legend }}
        </legend>
        <v-radio
          v-for="item in items"
          :id="'Radio_' + getIdText(item.id)"
          :class="[card ? '_radio-button-card' : '_radio-button',
                    errorMessages.length > 0 ? 'error--text v-input--has-state': '', 'ATATRadioGroup']"
          :key="item.id"
          :label="item.label"
          :value="item.value"
          :style="{ width: width }"
          :name="name"
          :disabled="item.disabled || disabled"
          @blur="onBlur"
          @click="onClick"
        >
          <template v-if="item.description && card" v-slot:label>
            <div class="d-flex flex-column">
              <p class="card-label">{{ item.label }}</p>
              <p class="mb-0">{{ item.description }}</p>
            </div>
          </template>
        </v-radio>
      </fieldset>
    </v-radio-group>
    <ATATErrorValidation :errorMessages="errorMessages" />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import { RadioButton } from "../../types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATErrorValidation,
  }
})

export default class ATATRadioGroup extends Vue {

  // refs
  $refs!: {
    radioButtonGroup: Vue & { errorBucket: string[]; errorCount: number };
  }; 

  // props
  @PropSync("value") private _selectedValue!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "" }) private legend!: string;
  @Prop({ default: [""] }) private items!: RadioButton[];
  @Prop({ default: ()=>[]}) private rules!: Array<unknown>;
  @Prop({ default: false }) private card!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop({ default: false }) private legendSrOnly!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop() private name!: string;

  // data
  private errorMessages: string[] = [];

  // methods
  private setErrorMessage(): void {
    this.errorMessages = this.$refs.radioButtonGroup.errorBucket;
  } 
  private clearErrorMessage(): void {
    this.errorMessages = [];
  } 

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/gi, "");
  }

  // events
  private onClick(): void {
    this.clearErrorMessage();
  }

  private onBlur(): void {
    this.setErrorMessage();
  }

  // watch
  @Watch("_selectedValue")
  protected valueChange(): void {
    this.$emit("radioButtonSelected", this._selectedValue);
  }
}
</script>
