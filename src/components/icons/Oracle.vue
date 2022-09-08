<template>
  <svg viewBox="0 0 40 40">
    <!-- eslint-disable -->
      <path class="st0" d="M12.6,32.2C5.6,32.2,0,26.6,0,19.6C0,12.6,5.6,7,12.6,7h14.8c7,0,12.6,5.6,12.6,12.6c0,7-5.6,12.6-12.6,12.6
	H12.6z" fill="#FFFFFF"/>
    <path class="st1" d="M12.6,32.2C5.6,32.2,0,26.6,0,19.6C0,12.6,5.6,7,12.6,7h14.8c7,0,12.6,5.6,12.6,12.6c0,7-5.6,12.6-12.6,12.6
	H12.6z M27,27.8c4.6,0,8.2-3.7,8.2-8.2c0-4.6-3.7-8.2-8.2-8.2H13c-4.6,0-8.2,3.7-8.2,8.2s3.7,8.2,8.2,8.2H27z" fill="#C74634"/>
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Oracle extends Vue {
  @Prop({default: "61686c", required: true}) private color!:string;
}
</script>
