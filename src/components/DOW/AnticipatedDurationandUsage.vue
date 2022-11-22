<template>
<div>
  <DescriptionOfNeed />
</div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";

import ATATTextArea from "@/components/ATATTextArea.vue";
import DescriptionOfNeed from "@/components/DOW/DescriptionOfNeed.vue";
import EntireDuration from "@/steps/05-PerformanceRequirements/DOW/EntireDuration.vue";

@Component({
  components: {
    DescriptionOfNeed,
    EntireDuration
  }
})

export default class AnticipatedDurationandUsage extends Vue {
  @Prop({required: true}) private type!: string;
}

</script>
