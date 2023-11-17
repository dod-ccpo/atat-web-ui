<template>
<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M14 8C14.34 8 14.67 8.04 15 8.09V3.27L7.5 0L0 3.27V8.18C0 12.72 3.2 16.97 7.5 18C8.05 17.87 8.58 17.68 9.1 17.45C8.41 16.47 8 15.28 8 14C8 10.69 10.69 8 14 8Z" fill="#61686C"/>
    <path d="M14 10C11.79 10 10 11.79 10 14C10 16.21 11.79 18 14 18C16.21 18 18 16.21 18 14C18 11.79 16.21 10 14 10ZM14 11.38C14.62 11.38 15.12 11.89 15.12 12.5C15.12 13.11 14.61 13.62 14 13.62C13.39 13.62 12.88 13.11 12.88 12.5C12.88 11.89 13.38 11.38 14 11.38ZM14 16.75C13.07 16.75 12.26 16.29 11.76 15.58C11.81 14.86 13.27 14.5 14 14.5C14.73 14.5 16.19 14.86 16.24 15.58C15.74 16.29 14.93 16.75 14 16.75Z" fill="#61686C"/>
    <!-- eslint-enable -->
</svg>

  </template>
  
<script lang='ts'>
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
  @Component({})
class Shield extends Vue {
    @Prop({default: "61686c", required: true}) private color!:string;
  }
export default toNative(Shield)
</script>
  