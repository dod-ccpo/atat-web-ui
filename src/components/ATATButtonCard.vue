<template>
  <v-radio-group
    row
    @change="(v) => $emit('change', v)"
    :rules="rules"
    v-model="selected_value"
    class="_v_radio-button-cards"
    column
    :ripple="false"
    ref="radiogroup"
    id="atat-button-cards"
  >
    <v-card
      v-for="(item, index) in items"
      :key="index"
      @click="selected_value = item.value"
      v-on:keydown.enter="selected_value = item.value"
      v-on:keydown.space="selected_value = item.value"
      :ripple="false"
      tabindex="-1"
      :class="{
        'radio-wrapper': true,
        'px-2': true,
        'py-2': true,
        'mr-4': true,
        'mb-2': true,
        'd-flex': true,
        'flex-column': true,
        active: selected_value === item.value,
        focus: focused_value === item.value,
      }"
      elevation="0"
      outlined
    >
      <v-radio 
        :value="item.value" 
        :ripple="false" 
        @focus="focused_value = item.value"
        @blur="focused_value = ''"
      >
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
          <div class="card-content text--base-darkest body-lg pl-7">
            {{ item.content }}
          </div>
        </v-row>
      </v-card-text>
    </v-card>
  </v-radio-group>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import { ButtonCardItem } from "../../types/Wizard";

@Component({})
export default class ATATButtonCard extends Vue {
  private focused_value = '';

  @Prop({ default: new Array<ButtonCardItem>(), required: true })
  private items!: Array<ButtonCardItem>;

  @Prop({ default: {}, required: false })
  private rules!: Array<unknown>;

  @PropSync("value", {
    default: () => "",
    required: false,
  })
  selected_value!: string;
}
</script>
