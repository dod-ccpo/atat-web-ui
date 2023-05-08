<template>
  <div v-if="isForm">
    <ATATTextArea
      :id="id"
      :label="label"
      class="max-width-740"
      :rows="7"
      :rules="rules"
      :helpText="helpText"
      :value.sync="_projectScope"
      maxChars="300"
    />
  </div>
  <div v-else>
     <dl class="vertical">
        <dt>Brief description of the requirement:</dt>
        <dd>{{ projectScope }}</dd>
      </dl> 
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
  @Prop({default: "ProjectScope"}) private id!: string;
  @Prop() private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true }) private isForm!: boolean;
  @PropSync("rules") private _rules!: "";
}
</script>
