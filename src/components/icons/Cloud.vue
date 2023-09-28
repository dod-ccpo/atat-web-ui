<template>
  <svg viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M16.125 5.36732C15.5583 2.49232 13.0333 0.333984 10 0.333984C7.59167 0.333984 5.5 1.70065 4.45833 3.70065C1.95 3.96732 0 6.09232 0 8.66732C0 11.4257 2.24167 13.6673 5 13.6673H15.8333C18.1333 13.6673 20 11.8007 20 9.50065C20 7.30065 18.2917 5.51732 16.125 5.36732ZM15.8333 12.0007H5C3.15833 12.0007 1.66667 10.509 1.66667 8.66732C1.66667 6.82565 3.15833 5.33398 5 5.33398H5.59167C6.14167 3.40898 7.9 2.00065 10 2.00065C12.5333 2.00065 14.5833 4.05065 14.5833 6.58398V7.00065H15.8333C17.2167 7.00065 18.3333 8.11732 18.3333 9.50065C18.3333 10.884 17.2167 12.0007 15.8333 12.0007Z"
          :fill="'#' + color"/>
  </svg>
  <!-- eslint-enable -->
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})
export default class Cloud extends Vue {
  @Prop({ default: "61686c", required: true }) private color!: string;
}
</script>
