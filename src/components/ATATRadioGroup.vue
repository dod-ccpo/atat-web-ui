<template>

  <v-radio-group
    v-model="_selectedValue">
    <v-radio
      v-for="item in items"
      :id="'Radio_' + getIdText(item.id)"
      :class="[card ? '_radio-button-card' : '_radio-button']"
      :key="item"
      :label="item.label"
      :value="item.value"
      :name="name"
    >
      <template v-if="item.description && card" v-slot:label>
        <div class="d-flex flex-column">
          <p class="card-label">{{ item.label }}</p>
          <p v-if="item.description" class="mb-0">{{ item.description }}</p>
        </div>
      </template>
    </v-radio>
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
  @Prop({default: ['empty items array']}) private items!: RadioButton[];
  @Prop({default: "no legend text passed"}) private legend!: string;
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private error!: boolean;
  @Prop({default: false}) private disabled!: boolean;

  @Prop() private name!: string;

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
}
</script>
