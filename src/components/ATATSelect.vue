<template>
  <div :id="id + '_dropdown_field_control'" class="atat-select">
    <v-flex>
      <label
        v-if="label"
        :id="id + '_dropdown_field_label'"
        :for="id + '_dropdown'"
        :class="{ 'd-sr-only': labelSrOnly }"
      >
        {{ label }}
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
    </v-flex>
    <v-flex>
      <v-select
        ref="atatSelect"
        :id="id + '_dropdown'"
        :items="items"
        outlined
        dense
        attach
        v-model="_selectedValue"
        :height="42"
        :rounded="rounded"
        :hide-details="true"
        :value.sync="_selectedValue"
        @change="onChange"
        @blur="onBlur"
        :placeholder="placeholder"
        :class="{ 'mt-2' : label }"
        :return-object="returnObject"
        :style="'max-width: ' + width + 'px; width: ' + width + 'px'"
        :rules="_rules"
        :menu-props="{ bottom: true, offsetY: true }"
        :disabled="menuDisabled"
      >
        <template v-if="showSelectedValue" v-slot:selection="{ item }">
          {{ item.value }}
        </template>

        <template v-slot:item="{ item, on }">
          <v-list-item 
            v-on="on" 
            :class="[
              {'_item-disabled': item.disabled },
              {'d-none': item.hidden },
              {'_selected': item.value === _selectedValue || item === _selectedValue }
            ]"
          >
            <v-list-item-content
              :id="id + '_DropdownListItem_' + item.text.replace(/[^A-Z0-9]/ig, '')"
              :item-value = item.value
            >
              <v-list-item-title class="body">
                {{ item.text }}
              </v-list-item-title>
              <v-list-item-subtitle v-if="item.description">
                {{ item.description }}
              </v-list-item-subtitle>

            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:append>
          <v-icon v-if="iconType === 'standard'">arrow_drop_down</v-icon>
          <div
            class="_dropdown-icon"
            v-if="iconType === 'chevron'"
          >
            <ATATSVGIcon 
              name="chevronDown" 
              color="base-darkest" 
              :width="10" 
              :height="7" 
            />
          </div>
        </template>
      </v-select>
  
      <ATATErrorValidation :errorMessages="errorMessages"  v-if="showErrorMessages" />

    </v-flex>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, PropSync, Watch } from "vue-property-decorator";

import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { SelectData } from "../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";

@Component({
  components: {
    ATATErrorValidation,
    ATATSVGIcon,
  }
})
export default class ATATSelect extends Vue {
  // refs
  $refs!: {
    atatSelect: Vue & { 
      errorBucket: string[]; 
      errorCount: number;
      blur: ()=> void;
      focus: ()=> void;
      validate: () => boolean;
    };
  }; 

  @PropSync("selectedValue") private _selectedValue!: string | SelectData;
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: [] }) private items?: SelectData[];
  @PropSync ("rules", { default: ()=>[] }) private _rules!: Array<unknown>;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: false }) private returnObject!: boolean;
  @Prop({ default: "" }) private width!: string;
  @Prop({ default: true }) private showErrorMessages?: boolean;
  @Prop({ default: "standard" }) public iconType?: string;
  @Prop({ default: false }) private menuDisabled?: boolean;
  @Prop({ default: false }) private showSelectedValue?: boolean;
  @Prop( {default: false }) private labelSrOnly?: boolean;

  //data
  private rounded = false;
  private selected: SelectData | string = "";
  private errorMessages: string[] = [];
  private selectedBeforeChange: SelectData | string = "";

  @Emit("onChange")
  private onChange(val: string | SelectData): void {
    const isString = typeof val === "string";
    const isObject = typeof val === "object"
    let isSelectable = true;
    if (isObject && Object.prototype.hasOwnProperty.call(val, "isSelectable")
      && val.isSelectable !== undefined) {
      isSelectable = val.isSelectable;
    }
    if (isString || isSelectable) {
      this.selected = val;
      this.setErrorMessage();
      this.$emit("selectValueChange", { 
        "newSelectedValue": val, 
        "selectedBeforeChange": this.selectedBeforeChange 
      });
      this.selectedBeforeChange = val;
    }
  }

  public get validateFormNow(): boolean {
    return AcquisitionPackage.getValidateNow;
  }

  @Watch('validateFormNow')
  public validateNowChange(): void {
    this.addRequiredRule();
    if(!this.$refs.atatSelect.validate()){
      this.setErrorMessage();
      this.$emit('errorMessage', this.errorMessages);
    }
  }

  public addRequiredRule(): void {
    // accommodates for dropdowns that are loaded
    // with no preselected value but required validation saveOnLeave
    Vue.nextTick(()=>{
      this._rules.push((v:string)=>v !== "" || "")
    })
  }

  private onInput(v: string) {
    this._selectedValue = v;
  }

  private setErrorMessage(): void {
    setTimeout(() => {
      this.errorMessages = this.$refs.atatSelect && Object.prototype.hasOwnProperty.call(
        this.$refs.atatSelect, "errorBucket"
      ) ? this.$refs.atatSelect.errorBucket : [];
      this.$emit('errorMessage', this.errorMessages);
    }, 0);
  }

  //@Events
  private onBlur(value: string) : void {
    this.setErrorMessage();
    this.$emit('blur', value);
  }

  public mounted(): void {
    this.selectedBeforeChange = this._selectedValue;
  }

}
</script>
