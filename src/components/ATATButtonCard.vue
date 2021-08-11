<template>
  <v-radio-group
    row
    @change="(v) => $emit('change', v)"
    v-model="selectedValue"
    class="_v_radio-button-cards"
    column
  >
    <v-card
      v-for="(item, index) in items"
      :key="index"
      @click="selectedValue = item.value"
      v-on:keydown.enter="selectedValue = item.value"
      v-on:keydown.space="selectedValue = item.value"
      :class="{
        'px-2': true,
        'py-2': true,
        'mr-2': true,
        'mb-2': true,
        'd-flex': true,
        'flex-column': true,
        active: selectedValue === item.value,
      }"
      elevation="0"
      outlined
    >
      <v-radio :value="item.value" :tabindex="index">
        <template v-slot:label>
          <div
            class="body-lg font-weight-bold text--base-darkest text-uppercase"
          >
            {{ item.label }}
          </div>
        </template>
      </v-radio>
      <v-card-text>
        <v-row>
          <div v-html="item.content"></div>
        </v-row>
      </v-card-text>
    </v-card>
  </v-radio-group>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { ButtonCardItem } from "../../types/Wizard";

@Component({})
export default class ATATButtonCard extends Vue {
  @Prop({ default: new Array<ButtonCardItem>() })
  private items!: Array<ButtonCardItem>;

  public selectedValue = "";
}
</script>
