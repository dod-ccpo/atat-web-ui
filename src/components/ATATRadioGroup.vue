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
          :disabled="item.disabled"
          @blur="setErrorMessage"
          @click="clearErrorMessage"
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
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import { RadioButton } from "../../types/Global";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

@Component({
  components: {
    ATATErrorValidation
  }
})
export default class ATATRadioGroup extends Vue {

  // refs
  $refs!: {
    radioButtonGroup: Vue & { errorBucket: string[]; errorCount: number };
  }; 

  @PropSync("value") private _selectedValue!: string;
  @Prop({ default: "" }) private id!: string;
  @Prop({ default: "" }) private legend!: string;
  @Prop({ default: ["empty items array"] }) private items!: RadioButton[];
  @Prop({ default: [] }) private rules!: [];
  @Prop({ default: false }) private card!: boolean;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private disabled!: boolean;
  @Prop({ default: false }) private legendSrOnly!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop() private name!: string;

  //data
  private errorMessages: string[] = [];
  private setErrorMessage(): void {
    this.errorMessages = this.$refs.radioButtonGroup.errorBucket;
  } 
  private clearErrorMessage(): void {
    this.errorMessages = [];
  } 

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/gi, "");
  }

  //@Events
  private onBlur() : void{
    this.setErrorMessage();
  }

  public async mounted(): Promise<void>{
    // this.setErrorMessage();
  }
}
</script>
