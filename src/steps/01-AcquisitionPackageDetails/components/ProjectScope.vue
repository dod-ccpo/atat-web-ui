<template>
  <div v-if="isForm">
    <ATATTextArea
      id="ProjectScope"
      :label="label"
      class="width-100"
      :rows="7"
      :rules="rules"
      :helpText="helpText"
      :value.sync="_projectScope"
      maxChars="300"
    />
  </div>
  <div v-else>
    <p>
      <strong>Brief description of the requirement:</strong> 
        {{ _projectScope }}
    </p>
   </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop, PropSync } from "vue-property-decorator";
import Vue from "vue";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  },
})
export default class ProjectScope extends Vue {
  @PropSync("projectScope", {default: "scope goes here"}) 
    private _projectScope!: string;
  @Prop() private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true }) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}
</script>
