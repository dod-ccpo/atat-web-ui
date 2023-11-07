<template>
  <div v-if="isForm">
    <ATATTextArea
      :id="id"
      :label="label"
      class="max-width-740"
      :rows="7"
      :rules="_rules"
      :helpText="helpText"
      :value="_projectScope"
      @update:value="_projectScope = $event"
      maxChars="300"
    />
  </div>
  <div v-else>
     <dl class="vertical">
        <dt>Brief description of the requirement:</dt>
        <dd>{{ _projectScope }}</dd>
      </dl> 
   </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Prop , Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
 
import ATATTextArea from "@/components/ATATTextArea.vue";
import { ValidationRule } from "types/Global";

@Component({
  components: {
    ATATTextArea,
  },
})
class ProjectScope extends Vue {
  @PropSync("projectScope", {default: ""}) private _projectScope!: string;
  @Prop({default: "ProjectScope"}) private id!: string;
  @Prop() private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true }) private isForm!: boolean;
  @PropSync("rules") private _rules!: ValidationRule;
}
export default toNative(ProjectScope)
</script>
