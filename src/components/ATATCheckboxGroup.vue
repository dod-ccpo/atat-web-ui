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
      :error="error"
      :disabled="disabled"
    >
      <template v-if="item.description && card" v-slot:label>
        <div class="d-flex flex-column">
          <p class="card-label">{{ item.label }}</p>
          <p class="mb-0">{{ item.description }}</p>
        </div>
      </template>
    </v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";

import {Checkbox} from "../../types/Global";

@Component({})

export default class ATATCheckboxGroup extends Vue {
  @PropSync("value") private _selected!: string;
  @Prop({default: [""], required: true}) private items!: Checkbox[];
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private error!: boolean;
  @Prop({default: false}) private disabled!: boolean;

  @Prop() private name!: string;

  private getIdText(string: string) {
    return string.replace(/[^A-Z0-9]/ig, "");
  }
}
</script>
