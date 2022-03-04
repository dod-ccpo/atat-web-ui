<template>
  <v-radio-group
    class="ATATRadioGroup"
    v-model="_selectedValue">
    <fieldset>
      <legend v-if="legend" class="form-field-label mb-3 pb-0">{{ legend }}</legend>
      <v-radio
        v-for="item in items"
        :id="'Radio_' + getIdText(item.id)"
        :class="[card ? '_radio-button-card' : '_radio-button']"
        :key="item.id"
        :label="item.label"
        :value="item.value"
        
        :name="name"
        :disabled="item.disabled"
      >
        <template v-if="item.description && card" v-slot:label>
          <div class="d-flex flex-column">
            <p class="card-label">{{ item.label }}</p>
            <p class="mb-0">{{ item.description }}</p>
          </div>
        </template>
      </v-radio>
    </fieldset>
  </v-radio-group>
</template>

<script lang="ts">
import {Component, Prop, PropSync} from "vue-property-decorator";
import Vue from "vue";
import {RadioButton} from "../../types/Global";

@Component({})
export default class ATATRadioGroup extends Vue {
  @PropSync("value") private _selectedValue!: string;
  @Prop({default: ""}) private legend!: string;
  @Prop({default: ['empty items array']}) private items!: RadioButton[];
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private error!: boolean;
  @Prop({default: false}) private disabled!: boolean;

  @Prop() private name!: string;

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
}
</script>
