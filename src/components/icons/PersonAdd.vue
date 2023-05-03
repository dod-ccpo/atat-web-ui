<template>
  <!-- eslint-disable -->
  <svg viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.4997 6.99967C14.3413 6.99967 15.833 5.50801 15.833 3.66634C15.833 1.82467 14.3413 0.333008 12.4997 0.333008C10.658 0.333008 9.16634 1.82467 9.16634 3.66634C9.16634 5.50801 10.658 6.99967 12.4997 6.99967ZM4.99967 5.33301V2.83301H3.33301V5.33301H0.833008V6.99967H3.33301V9.49967H4.99967V6.99967H7.49967V5.33301H4.99967ZM12.4997 8.66634C10.2747 8.66634 5.83301 9.78301 5.83301 11.9997V13.6663H19.1663V11.9997C19.1663 9.78301 14.7247 8.66634 12.4997 8.66634Z"
      :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class PersonAddAlt extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
