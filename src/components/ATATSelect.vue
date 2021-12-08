<template>
  <div :id="id + '_dropdown_field_control'" class="atat-select">
    <v-flex>
      <label
        :id="id + '_dropdown_field_label'"
        :class="[isErrored ? 'font-weight-bold' : 'form-field-label my-1']"
        :for="id + '_dropdown'"
      >
        {{ label }}
      </label>
    </v-flex>
    <v-flex>
      <v-select
        :id="id + '_dropdown'"
        :items="items"
        :rules="rules"
        outlined
        dense
        attach
        :success="isSuccess"
        :error="isErrored"
        v-model="_selectedValue"
        :height="42"
        :rounded="rounded"
        hide-details="auto"
        :value.sync="_selectedValue"
        @change="onChange"
        :placeholder="placeholder"
        :validate-on-load="validateOnLoad"
        @blur="validateField()"
        :class="[
          isErrored ? 'invalid-icon' : '',
          isSuccess ? 'valid-icon' : '',
          isErrored || isSuccess ? 'show-validation-icon' : '',
        ]"
      >
        <template v-slot:selection="{ item }">
          {{ item }}
        </template>
        <template v-slot:item="{ item, on }">
          <v-list-item v-on="on">
            <v-list-item-content
              :id="id + '_dropdown_list_item_' + item.replace(/ /g, '_')"
            >
              <v-list-item-title class="body">
                <v-row no-gutters align="center">
                  <span>{{ item }}</span>
                </v-row>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <template v-slot:append>
          <v-icon>unfold_more</v-icon>
        </template>
      </v-select>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class ATATSelect extends Vue {
  @PropSync("selectedValue") private _selectedValue!: string;
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({
    default: () => ["Foo", "Bar", "Fizz Tony", "Buzz"],
  })
  private items!: string[];
  @Prop() private rules: any;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Prop({ default: false }) private validateOnLoad!: boolean;

  //data
  private rounded = false;
  private isFieldValid = false;
  private selected = "";
  private isFieldDirty = false;
  private hasInitialValue = false;

  private validateField() {
    // if the rules property isn't set we won't display an icon
    // when the rules property is populated (i.e when the parent form is saved)
    // we evalute the rules to determine what icon to display
    this.isFieldDirty = true;

    if (this.$props["rules"].length > 0) {
      let value = this._selectedValue;
      this.isFieldValid = this.$props["rules"].every(
        (rule: (a: unknown) => string | boolean) => rule(value) === true
      );
    }

    this.$emit("blur");
  }

  get isSuccess(): boolean {
    return this.isFieldDirty === true && this.isFieldValid === true;
  }

  get isErrored(): boolean {
    return (this.isFieldDirty || this.hasInitialValue) && !this.isFieldValid;
  }

  private onChange(val: string): void {
    this.selected = val;
  }

  private mounted(): void {
    this.$nextTick(() => {
      this.hasInitialValue = this._selectedValue.length > 0;
      if (this.validateOnLoad || this.hasInitialValue) {
        this.validateField();
      }
    });
  }
}
</script>
