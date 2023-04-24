<template>
  <svg viewBox="0 0 14 19" xmlns="http://www.w3.org/2000/svg">
    <!-- eslint-disable -->
    <path d="M7.00016 2.83594V0.335938L3.66683 3.66927L7.00016 7.0026V4.5026C9.7585 4.5026 12.0002 6.74427 12.0002 9.5026C12.0002 10.3443 11.7918 11.1443 11.4168 11.8359L12.6335 13.0526C13.2835 12.0276 13.6668 10.8109 13.6668 9.5026C13.6668 5.81927 10.6835 2.83594 7.00016 2.83594ZM7.00016 14.5026C4.24183 14.5026 2.00016 12.2609 2.00016 9.5026C2.00016 8.66094 2.2085 7.86094 2.5835 7.16927L1.36683 5.9526C0.716829 6.9776 0.333496 8.19427 0.333496 9.5026C0.333496 13.1859 3.31683 16.1693 7.00016 16.1693V18.6693L10.3335 15.3359L7.00016 12.0026V14.5026Z"
          :fill="'#' + color"
    />
    <!-- eslint-enable -->
  </svg>
</template>

<script lang='ts'>
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class Update extends Vue {
  @Prop({ default: "161B1E", required: false }) private color?:string;
}
</script>
