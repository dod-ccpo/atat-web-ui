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
      <!-- TODO: use the new menu prop 'offset' to achieve what 'offsetY: true' did before -->

      <!-- 
        @update:model-value="onChange" 
      
      
      
      -->

      <v-select
        ref="atatSelect"
        :id="id + '_dropdown'"
        :items="items"
        variant="outlined"
        v-model="_selectedValue"
        @update:v-model="_selectedValue = $event"

        item-title="text"
        item-value="value"

        :rounded="rounded"
        :hide-details="true"
        @blur="onBlur"
        :placeholder="placeholder"
        :class="{ 'mt-2' : label }"
        :return-object="returnObject"
        :style="'max-width: ' + width + 'px; width: ' + width + 'px'"
        :rules="_rules"
        :menu-props="{ location: 'bottom', offset: 0 }"
        :disabled="menuDisabled"
        :eager="true"
      >
        <template v-if="showSelectedValue" v-slot:selection="{ item }">
          {{ item.value }}
        </template>
        <template v-slot:item="{ props, item }">
          <v-list-item 
            v-bind="props"
            :id="getIdText(item.value)"
            :class="[
              {'_item-disabled': item.value.disabled },
              {'d-none': item.value.hidden },
              {'_selected': item.value.value === _selectedValue || item.value === _selectedValue }
            ]"
            :title="item?.raw?.text"
            :subtitle="item?.raw?.description"
          />
        </template>
      </v-select>
  
      <ATATErrorValidation :errorMessages="errorMessages"  v-if="showErrorMessages" />

    </v-flex>
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Component, Emit, Prop, Vue, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { SelectData, ValidationRule } from "../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATErrorValidation,
    ATATSVGIcon,
  }
})
class ATATSelect extends Vue {
  // refs
  $refs!: {
    atatSelect: ComponentPublicInstance & {
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
  @PropSync ("rules", { default: ()=>[] }) private _rules!: ValidationRule[];
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

  public getIdText(text: string): string {
    return this.id + "_DropdownListItem_" + getIdText(text);  
  }

  @Emit("onChange")
  private onChange(val: string | SelectData): void {
    this._selectedValue = val
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

  // @Emit("onChange")
  // private onChange(val: string | SelectData): void {
  //   debugger;
  //   const isString = typeof val === "string";
  //   const isObject = typeof val === "object"
  //   let isSelectable = true;
  //   if (isObject && Object.prototype.hasOwnProperty.call(val, "isSelectable")
  //     && val.isSelectable !== undefined) {
  //     isSelectable = val.isSelectable;
  //   }
  //   if (isString || isSelectable) {
  //     this.selected = val;
  //     this.setErrorMessage();
  //     this.$emit("selectValueChange", { 
  //       "newSelectedValue": val, 
  //       "selectedBeforeChange": this.selectedBeforeChange 
  //     });
  //     this.selectedBeforeChange = val;
  //   }
  // }

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
    this.$nextTick(()=>{
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
export default toNative(ATATSelect)
</script>
