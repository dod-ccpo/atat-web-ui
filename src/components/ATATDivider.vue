<template>
  <div class="_divider-wrap">
    <div 
      v-if="badgeText"
      :class="[ '_divider-badge', 'bg-' + badgeColor ]"
    >
      {{ badgeText }}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATDivider extends Vue {
  @Prop() badgeText?: string;
  @Prop({ default: "base-lightest" }) badgeColor?: string;
}

</script>
