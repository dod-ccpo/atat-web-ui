<template>
  <v-radio-group v-model="_selectedValue">
    <v-radio
        v-for="item in items"
        :class="[card? '_radio-button-card': '_radio-button']"
        :key="item"
        :label="item"
        :value="item"/>
  </v-radio-group>
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
