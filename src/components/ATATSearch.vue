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
    <div 
      class="d-flex"
      :style="'width: ' + width + 'px'"
    >
      <v-text-field
        :id="id + '_SearchInput'"
        class="_search-input"
        clearable
        @input="onInput"
        outlined
        dense
        :height="40"
        :value.sync="_value"
        :placeholder="placeHolder"

        autocomplete="off"

      />
      <v-btn
        :id="id + '_SearchButton'" 
        class="primary _search-button"
      >
        <ATATSVGIcon 
          name="search"
          color="white"
          width="18"
          height="18"
        />
      </v-btn>
    </div>

    <ATATAlert
      :id="id + '_SearchAlert'"
      type="error"
      v-show="error"
      maxWidth="660"
    >
      <template v-slot:content>
        <p>
          We could not find your order within G-Invoicing. Please enter a valid 
          order number and search again. 
        </p>
        <p class="mb-0">
          If you confirmed your order number within G-Invoicing and continue to 
          receive this message, please reach out to our User Engagement Team for 
          support.          
        </p>
      </template>
    </ATATAlert>


  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import ATATTooltip from "@/components/ATATTooltip.vue"
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";


@Component({
  components: {
    ATATAlert,
    ATATSVGIcon,
    ATATTooltip,
  },
})

export default class ATATSearch extends Vue {
  @Prop({ default: "Search" }) private id!: string;
  @Prop({ default: "" }) private placeHolder!: string;
  @Prop({ default: "320" }) private width!: string;
  @Prop({ default: "" }) private label!: string;
  @Prop({ default: "" }) private tooltipTitle!: string;
  @Prop({ default: "" }) private tooltipText!: string;

  @PropSync("value", { default: "" }) private _value!: string;

  private error = true;
  private errorMessages: string[] = [];
  private onInput(v: string) {
    this._value = v;
  }


}

</script>