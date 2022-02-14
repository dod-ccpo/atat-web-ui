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
        outlined
        dense
        attach
        v-model="_selectedValue"
        :height="42"
        :rounded="rounded"
        hide-details="auto"
        :value.sync="_selectedValue"
        @change="onChange"
        :placeholder="placeholder"
        class="mt-2"
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
          <v-icon>arrow_drop_down</v-icon>
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
    default: () => [
      'Programming',
      'Design',
      'Vue',
      'Vuetify',
    ],
  })
  private items!: string[];
  @Prop() private rules: any;
  @Prop({ default: "id_is_missing" }) private id!: string;
  @Prop({ default: false }) private error!: boolean;

  //data
  private rounded = false;
  private selected = "";


  private onChange(val: string): void {
    this.selected = val;
  }
}
</script>
