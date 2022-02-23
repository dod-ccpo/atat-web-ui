<template>
  <v-container fluid>
    <v-radio-group v-model="_selectedValue">
      <v-radio :class="[card? '_v_radio-button-cards': '_radio-button','pl-3','py-3']" v-for="item in items" :key="item" :label="item" :value="item"></v-radio>
    </v-radio-group>
  </v-container>
</template>

<script lang="ts">
import {Component, Prop, PropSync} from "vue-property-decorator";
import Vue from "vue";

@Component({})
export default class ATATRadioGroup extends Vue {
  @PropSync("value") private _selectedValue!: string;
  @Prop({default: "Form Field Label"}) private label!: string;
  @Prop({default: ['empty items array']}) private items!: string[];
  @Prop({default: false}) private card!: boolean;
}
</script>
