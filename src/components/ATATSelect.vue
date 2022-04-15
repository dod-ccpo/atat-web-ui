<template>
  <div :id="id + '_dropdown_field_control'" class="atat-select">
    <v-flex>
      <label
        v-if="label"
        :id="id + '_dropdown_field_label'"
        :for="id + '_dropdown'"
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
        :style="'width: ' + width + 'px'"
        :rules="rules"
      >
          <!-- hide-details="auto" -->


        <template v-slot:item="{ item, on }">
          <v-list-item v-on="on">
            <v-list-item-content
              :id="id + '_DropdownListItem_' + item.text.replace(/[^A-Z0-9]/ig, '')"
              :item-value = item.value
            >
              <v-list-item-title class="body">
                <v-row no-gutters align="center">
                  <span>{{ item.text }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:append>
          <v-icon>arrow_drop_down</v-icon>
        </template>
      </v-select>
  
      <ATATErrorValidation :errorMessages="errorMessages" />

    </v-flex>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Emit, Prop, PropSync } from "vue-property-decorator";

import ATATErrorValidation from "@/components/ATATErrorValidation.vue";

import { SelectData } from "../../types/Global";

@Component({
  components: {
    ATATErrorValidation
  }
})
export default class ATATSelect extends Vue {
  // refs
  $refs!: {
    atatSelect: Vue & { errorBucket: string[]; errorCount: number };
  }; 

  @PropSync("selectedValue") private _selectedValue!: string | SelectData;
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: [] }) private items?: SelectData[];
  @Prop({ default: ()=>[] }) private rules!: Array<unknown>;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: false }) private optional!: boolean;
  @Prop({ default: false }) private returnObject!: boolean;
  @Prop({ default: "" }) private width!: string;

  //data
  private rounded = false;
  private selected = "";

  @Emit("onChange")
  private onChange(val: string): void {
    this.selected = val;
  }

  private onInput(v: string) {
    this._selectedValue = v;
  }
  private errorMessages: string[] = [];

  private setErrorMessage(): void {
    this.errorMessages = this.$refs.atatSelect.errorBucket;
  }

  //@Events
  private onBlur(value: string) : void {
    this.setErrorMessage();
    this.$emit('blur', value);
  }

}
</script>
