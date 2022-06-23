<template>
  <div id="SearchWrapper">

    <div class="d-flex align-center" v-if="label">
      <label
        :id="id + '_Label'"
        class="form-field-label mb-2 mr-1"
        :for="id + '_SearchInput'"
      >
        {{ label }}
      </label>
      <ATATTooltip 
        :tooltipText="tooltipText"
        :tooltipTitle="tooltipTitle"
        :id="id"
        :label="label"
      />
    </div>

    <v-text-field
      :id="id + '_SearchInput'"
      class="_search-input"
      clearable
      @input="onInput"
      outlined
      dense
      :height="42"
      :value.sync="_value"
      :placeholder="placeHolder"
      :style="'width: ' + width + 'px'"

      autocomplete="off"

    />
    <v-btn class="primary">
      <ATATSVGIcon 
        name="search"
        color="white"
        width="18"
        height="18"
      />
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
    ATATTooltip,
  },
})

export default class ATATSearch extends Vue {
  @Prop({ default: "Search" }) private id!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "272" }) private width!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;

  @PropSync("value", { default: "" }) private _value!: string;

  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
  }


}

</script>