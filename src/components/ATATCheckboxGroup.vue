<template>
  <div>
    <v-checkbox
      v-for="item in items"
      v-model="_selected"
      :id="'Checkbox_' + getIdText(item.id)"
      :class="[
        card ? '_checkbox-card' : '_checkbox',
        { 'flex-column _has-other': item.label === 'Other' },
        { '_other-selected': showOtherTextarea(item.label) }
      ]"
      :key="item.value"
      :label="item.label"
      :value="item.value"
      :name="name"
      :error="error"
      :disabled="disabled"
    >
      <template v-if="card || item.label === 'Other' " v-slot:label>
        <div class="d-flex flex-column width-100">
          <p 
            v-if="item.label" 
            :class="[
              {'card-label': item.label}, 
              {'mb-0': item.label === 'Other'}
            ]"
          >
            {{ item.label }}
          </p>
          <p 
            v-if="item.description"
            class="mb-0" v-html="item.description"
          ></p>
        </div>
      </template>
      <!-- <v-expand-transition> -->
        <template v-slot:append v-if="showOtherTextarea(item.label)">
          <ATATTextArea
            id="OtherEntry"
            class="width-100 ml-5 mb-6"
            :rows="3"
            :rules="[
              $validators.required(
                'Please enter your packaging, packing and shipping instructions.'
              ),
            ]"
            :value="_otherValue"
            @blur="setOtherValue"
          />
        </template>
      <!-- </v-expand-transition> -->

    </v-checkbox>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import {Component, Prop, PropSync} from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";

import {Checkbox} from "../../types/Global";
import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATTextArea,
  }
})

export default class ATATCheckboxGroup extends Vue {
  @PropSync("value") private _selected!: string[];
  @PropSync("otherValue") private _otherValue!: string;
  @Prop({default: [""], required: true}) private items!: Checkbox[];
  @Prop({default: false}) private card!: boolean;
  @Prop({default: false}) private error!: boolean;
  @Prop({default: false}) private disabled!: boolean;
  @Prop({default: false}) private hasOtherValue!: boolean;

  @Prop() private name!: string;

  private getIdText(string: string) {
    return getIdText(string);
  }

  private showOtherTextarea(label: string): boolean {
    return this.hasOtherValue 
      && label === 'Other'
      && this._selected.indexOf("Other") > -1;
  }

  private setOtherValue(value: string): void {
    debugger;
    this._otherValue = value;
  }

  // private stopBubble(e: Event): void {
  //   debugger;
  //   e.preventDefault()
  //   e.stopPropagation()
  //   console.log('foobar')
  // }

}
</script>
