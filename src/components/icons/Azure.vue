<template>
  <!-- eslint-disable -->
  <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
       viewBox="0 0 40 40" style="enable-background:new 0 0 40 40;" xml:space="preserve">
    <path class="st0" d="M18.5,33.3c5.1-0.9,9.4-1.7,9.4-1.7H28l-4.9-5.8c-2.7-3.2-4.9-5.8-4.9-5.8s5-13.8,5-13.9c0,0,3.4,5.9,8.3,14.3
	c4.5,7.9,8.3,14.3,8.3,14.4L40,35H24.6H9.2L18.5,33.3z M0,31.6c0,0,2.3-4,5.1-8.8l5.1-8.8l5.9-5C19.3,6.2,22,4,22,4s0,0.1-0.1,0.2
	s-3,6.3-6.4,13.8L9.2,31.6H4.6C2.1,31.6,0,31.6,0,31.6z" fill="#0089D6"/>
</svg>
  <!-- eslint-enable -->
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class Azure extends Vue {
  @Prop({ default: "161B1E", required: false }) private color!:string;
}
</script>
