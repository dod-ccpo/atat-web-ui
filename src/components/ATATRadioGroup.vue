<template>
  <v-radio-group v-model="_selectedValue">
    <v-radio
        v-for="item in items"
        :id="'Radio_' + getIdText(item.id)"
        :class="[card ? '_radio-button-card' : '_radio-button']"
        :key="item"
        :label="item.label"
        :value="item.value"/>
  </v-radio-group>
</template>

<script lang="ts">
import {Component, Prop, PropSync} from "vue-property-decorator";
import Vue from "vue";
import {RadioButton} from "../../types/Global";

@Component({})
export default class ATATRadioGroup extends Vue {
  @PropSync("value") private _selectedValue!: string;
  @Prop({default: "Form Field Label"}) private label!: string;
  @Prop({default: ['empty items array']}) private items!:RadioButton[];
  @Prop({default: false}) private card!: boolean;

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
}
</script>
