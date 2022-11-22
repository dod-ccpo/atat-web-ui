<template>

</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";

@Component({
  components: {
    ATATTextArea,
  }
})

export default class AnticipatedDurationandUsage extends Vue {
  @Prop("anticipatedNeedUsage") public _anticipatedNeedUsage!: string;
  @Prop() public index!: number;
  @Prop({ default: "requirement" }) public requirementOrInstance?: string;
}

</script>
