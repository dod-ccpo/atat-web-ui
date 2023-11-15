<template>
  <div :id="id + '_AutoComplete_Wrapper'">
    <label :for="id" :class="{ 'd-sr-only': labelSrOnly }" class="mb-2 d-block">
      {{ label }}
      <span v-if="optional" class="optional"> Optional </span>
    </label>
    <v-autocomplete
      ref="atatAutoComplete"
      :id="id"
      :class="inputClass"

      :items="items"
      :item-title="titleKey"
      :item-value="valueKey"
      :eager="true"
      :placeholder="placeholder"
      return-object
      clearable
      clear-icon="mdi-close"

      :model-value="_selectedItem"
      @update:modelValue="valueUpdate"

      :hide-details="true"
      :rules="rules"
      variant="outlined"

      :search="searchText"
      @update:search="searchText = $event"
      @blur="onBlur"

    >
    <!-- 
      @click:clear="valueCleared"
      :customFilter="customFilter" 
      @update:search="updateSearchInput" 
    -->

      <template v-slot:item="{ props, item }">
        <v-list-item 
          v-bind="props"
          :class="{ 'font-weight-normal': !subtitleKey }"
          :title="item?.raw?.[titleKey]"
          :subtitle="item?.raw?.[subtitleKey]"
        />
      </template>

      <template v-slot:no-data>
        <v-list-item v-show="searchText !== null" class="no-results">
          <v-list-item-title>
            No results found.
            <a
              v-if="noResultsText"
              @click="noResultsAction"
              class="_text-link"
              role="button"
              tabindex="0"
              :id="'NoResults_' + id"
            >
              {{ noResultsText }}
            </a>
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
    <ATATErrorValidation :errorMessages="errorMessages" />

  </div>
</template>

<script lang="ts">
/* eslint vue/no-v-text-v-html-on-component: 1 */
import { ComponentPublicInstance } from "vue";
import { AutoCompleteItem, ValidationRule } from "types/Global";

import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import ATATErrorValidation from "@/components/ATATErrorValidation.vue";
import { PropSync } from "@/decorators/custom";

@Component({
  components: {
    ATATErrorValidation
  }
})

class ATATAutoComplete extends Vue {
  // refs
  $refs!: {
    atatAutoComplete: ComponentPublicInstance &
    {
      blur: ()=> void;
      focus: ()=> void;
      validate: () => Promise<string[]>;
    };
  };
  // data
  private errorMessages: string[] = [];
  private searchText = "";
  private isReset = false;

  // props

  @Prop({ default: "", required: true }) private id!: string;
  @Prop({ default: "", required: true }) private label!: string;
  @Prop({ default: false }) private labelSrOnly!: string;
  @Prop({ default: "" }) private icon!: string;
  @Prop({ default: () => [] }) private rules!: ValidationRule[];
  @Prop({ default: "text", required: true }) private titleKey!: string;
  @Prop({ default: "value", required: true }) private valueKey!: string;
  @Prop({ default: "" }) private subtitleKey!: string;
  @Prop({ default: [], required: true }) private searchFields!: string[];
  @Prop({ default: () => [] , required: true }) private items!: AutoCompleteItem[];
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private optional!: boolean;
  @Prop({ default: "" }) private noResultsText!: string;
  @PropSync("selectedItem") private _selectedItem!: AutoCompleteItem;

  public emptySelectedItem = { [this.titleKey]: "", [this.valueKey]: "" };

  // computed

  get inputClass(): string {
    let inputClass = this.icon.length ? "is-" + this.icon + "-icon" : "";
    if (this.icon === "search") {
      inputClass += " icon-no-rotate";
    }
    return inputClass;
  }

  // methods

  private noResultsAction() {
    this._selectedItem.text = "";
    this._selectedItem.value = "";
    this.searchText = "";
    this.isReset = true;
  }

  private setErrorMessage(): void {
    this.$refs.atatAutoComplete.validate().then(
      async (response: string[]) => {
        debugger;
        this.errorMessages = response;
      }
    );
  }
  //@Events
  private onBlur() : void{
    this.setErrorMessage();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private valueUpdate(val: any): void {
    this._selectedItem[this.titleKey] = val ? val[this.titleKey] : "";
    this._selectedItem[this.valueKey] = val ? val[this.valueKey] : "";
  }

}
export default toNative(ATATAutoComplete)
</script>
