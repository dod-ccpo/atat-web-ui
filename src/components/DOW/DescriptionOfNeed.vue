<template>
  <ATATTextArea
    :value="_anticipatedNeedUsage"
    @update:value="_anticipatedNeedUsage = $event"
    :id="'AnticipatedNeedUsage_' + (index + 1)"
    ref="DescriptionOfNeed"
    label="Statement of objectives for the anticipated need or usage"
    :helpText="description"
    class="width-100 mb-10 max-width-740"
    :rows="5"
    maxChars="800"
    :rules="[
      $validators.required('Please provide a description for this ' + requirementOrInstance + '.'),
      $validators.maxLength(500, 'Description is to be 500 characters or less.')
    ]"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  }
})

class DescriptionOfNeed extends Vue {
  @PropSync("anticipatedNeedUsage") public _anticipatedNeedUsage!: string;
  @Prop() public index!: number;
  @Prop({ default: "requirement" }) public requirementOrInstance?: string;
  @Prop({ default: "" }) public description?: string;
}
export default toNative(DescriptionOfNeed)
</script>
