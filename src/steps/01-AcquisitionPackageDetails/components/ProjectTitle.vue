<template>
  <div v-if="isForm">
    <h2 class='mb-5'>
      1. Basic project information
    </h2>
    
    <ATATTextField
      :id="id"
      :label="label"
      :rules="rules"
      class="_input-max-width"
      tooltipText="Provide a short, descriptive title of the work to
              be performed. This will be used to refer to this project within 
              ATAT and across all acquisition documents."
      :value.sync="_currentTitle"
    />
  </div>
  <div v-else> 
      <dl>
        <dt>Requirements Title:</dt>
        <dd>{{ _currentTitle }}</dd>
      </dl>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";

@Component({
  components: {
    ATATTextField,
  },
})
export default class ProjectTitle extends Vue {
  @PropSync("currentTitle", {default: "title goes here"}) 
  private _currentTitle!: string;
  @Prop({default: "ProjectTitle"}) private id!: string;
  @Prop() private label!: string;
  @Prop({ default: "title goes here" }) private helpText!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}
</script>
