<template>
  <div v-if="isForm">
    <h2 class='mb-5'>
      1. Basic project information
    </h2>
    
    <ATATTextField
      ref="ProjectTitleRef"
      :id="id"
      :label="label"
      :rules="_rules"
      class="_input-max-width"
      tooltipText="Provide a short, descriptive title of the work to
              be performed. This will be used to refer to this project within 
              ATAT and across all acquisition documents."
      :value="_currentTitle"
      @update:value="_currentTitle = $event"
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
 
import { Component, Prop , Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom"
import ATATTextField from "@/components/ATATTextField.vue";
import { ValidationRule } from "types/Global";

@Component({
  components: {
    ATATTextField,
  },
})
class ProjectTitle extends Vue {
  @PropSync("currentTitle", {default: ""}) private _currentTitle!: string;
  @Prop({default: "ProjectTitle"}) private id!: string;
  @Prop() private label!: string;
  @Prop({ default: "" }) private helpText!: string;
  @Prop({ default: true}) private isForm!: boolean;
  @PropSync("rules") private _rules!: ValidationRule;
}
export default toNative(ProjectTitle)
</script>
