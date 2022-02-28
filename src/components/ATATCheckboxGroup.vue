<template>
  <div>
    <v-checkbox
      v-for="item in items"
      v-model="_selected"
      :id="'Checkbox_' + getIdText(item.id)"
      :class="[card ? '_checkbox-card' : '_checkbox']"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :name="name"

    />
  </div>
</template>

<script lang="ts">
import {Component, Prop, PropSync} from "vue-property-decorator";
import Vue from "vue";
import {Checkbox} from "../../types/Global";

@Component({})
export default class ATATCheckboxGroup extends Vue {
  @PropSync("value") private _selected!: string;
  @Prop({default: "Form Field Label"}) private label!: string;
  @Prop({default: ['empty items array']}) private items!: Checkbox[];
  @Prop({default: false}) private card!: boolean;
  @Prop() private name!: string;

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
}
</script>
