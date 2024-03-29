<template>
  <div :id="id + '_dropdown_field_control'" class="_atat-select">
    <div>
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
    </div>
    <div>
      <v-select
        ref="atatSelect"
        :id="id + '_dropdown'"
        :items="items"
        :variant="variant"
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
        location="bottom"
        offset="0"
        anchor="bottom end"
        :disabled="menuDisabled"
        
        menu-icon="mdi-chevron-down"
      >
        <template v-if="showSelectedValue" v-slot:selection="{ item }">
          {{ item.value }}
        </template>
        <template v-slot:item="{ props, item }">
          <v-divider v-if="item?.raw?.type === 'divider'" />
          <v-list-subheader v-else-if="item?.raw?.type === 'subheader'">
            {{ item?.raw?.text }}
          </v-list-subheader>
          <v-list-item 
            v-else
            v-bind="props"
            :id="getIdText(item)"
            :class="[
              {'_item-disabled': item.value.disabled },
              {'d-none': item.value.hidden },
              {'_selected': item.value.value === _selectedValue || item.value === _selectedValue }
            ]"
            :title="item?.raw?.text"
            :subtitle="item?.raw?.description"
          />
        </template>

        <!-- <template v-slot:append-inner>
          <v-icon v-if="iconType === 'standard'">mdi-menu-down</v-icon>
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
        </template> -->

      </v-select>
  
      <ATATErrorValidation :errorMessages="errorMessages"  v-if="showErrorMessages" />

    </div>
  </div>
</template>

<script lang="ts">
import { ComponentPublicInstance } from "vue";
import { Component, Emit, Prop, Vue, Watch, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { MenuVariant, SelectData, ValidationRule } from "../../types/Global";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { getIdText } from "@/helpers";

@Component({
  emits:[
    "errorMessage",
    "blur"
  ],
  components: {
    ATATErrorValidation,
    ATATSVGIcon,
  }
})
class ATATSelect extends Vue {
  // refs
  $refs!: {
    atatSelect: (ComponentPublicInstance)& {
      validate: () => Promise<string[]>
    }
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
  @Prop( { default: "outlined" }) private variant!: MenuVariant;

  //data
  private rounded = false;
  private selected: SelectData | string = "";
  private errorMessages: string[] = [];
  private selectedBeforeChange: SelectData | string = "";

  public getIdText(item: SelectData): string {
    const key = Object.keys(item).includes("text") ? "text" : Object.keys(item)[0];
    return this.id + "_DropdownListItem_" + getIdText(key);  
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
 
  private onInput(v: string) {
    this._selectedValue = v;
  }

  private setErrorMessage(): void {
    this.$refs.atatSelect.validate().then(
      async (response:string[])=> {
        this.errorMessages = response;
        this.$emit('errorMessage', this.errorMessages);
      }
    );
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
