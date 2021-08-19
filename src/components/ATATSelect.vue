<template>
  <div :id="id + '_dropdown_field_control'" class="atat-select">
    <v-flex>
      <label
        :id="id + '_dropdown_field_label'"
        class="form-field-label my-1"
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
        :success="_selectedValue !== '' && rules && rules.length > 0"
        :append-outer-icon="appendedOuterIcon"
        v-model="_selectedValue"
        :height="42"
        :rounded="rounded"
        hide-details="auto"
        :value.sync="_selectedValue"
        @change="(v) => $emit('change', v)"
        :placeholder="placeholder"
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
import { VSelect } from "vuetify/lib";
import { Component, Prop, PropSync, Watch } from "vue-property-decorator";

@Component({})
export default class ATATSelect extends VSelect {
  @PropSync("selectedValue") private _selectedValue!: unknown;
  @Prop({ default: "" }) private placeholder!: string;
  @Prop({ default: "Form Field Label" }) private label!: string;
  @Prop({
    default: () => ["Foo", "Bar", "Fizz Tony", "Buzz"],
  })
  private items!: string[];
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: false }) private error!: boolean;
  @Prop({ default: "auto" }) private hideDetails!: boolean | string;
  @Watch("errorBucket")
  onErrorBucketChanged(): void {
    this.getStatusIcon();
  }

  @Watch("selectedValue")
  onSelectedValueChanged(newVal: string, oldVal: string): void {
    this.selected = newVal;
    this.getStatusIcon();
  }

  //data
  private rounded = false;
  private appendedOuterIcon = "";
  private isFieldValid = false;
  private selected = "";

  private getStatusIcon() {
    this.$nextTick(() => {
      // if the rules property isn't set we won't display an icon
      // when the rules property is populated (i.e when the parent form is saved)
      // we evalute the rules to determine what icon to display
      if (this.$props["rules"].length > 0) {
        const v = this._selectedValue;
        this.isFieldValid = this.$props["rules"].every(
          (rule: (a: unknown) => string | boolean) => rule(v) === true
        );

        this.appendedOuterIcon = this.isFieldValid ? "check_circle" : "error";
      }
    });
  }

  private updated() {
    this.getStatusIcon();
  }
}
</script>
