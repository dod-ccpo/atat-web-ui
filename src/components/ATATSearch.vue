<template>
  <div id="SearchWrapper">

    <div class="d-flex align-center" v-if="label">
      <label
        :id="id + '_Label'"
        class="form-field-label mb-2 mr-1"
        :for="id + '_SearchInput'"
      >
        {{ label }}
        <span v-if="optional" class="optional">
          Optional
        </span>
      </label>
      <ATATTooltip 
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
    </div>

    <v-text-field
      clearable
      @input="onInput"
      :id="id + '_SearchInput'"
      outlined
      dense
      :height="42"
      :value.sync="_value"
      :placeholder="placeHolder"
      :style="'width: ' + width + 'px'"

      autocomplete="off"

    ></v-text-field>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"

@Component({
  components: {
    ATATTooltip,
  },
})

export default class ATATSearch extends Vue {
  @Prop({ default: "Search" }) private id!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "272" }) private width!: string;
  @Prop({ default: "" }) private label!: string;

  @PropSync("value", { default: "" }) private _value!: string;

  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
  }


}

</script>