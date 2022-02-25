<template>
  <v-app>
    <ATATSideStepper />
    <ATATPageHead />
    <v-main id="app">
      <router-view></router-view>
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATFooter from "./components/ATATFooter.vue";
import ATATPageHead from "./components/ATATPageHead.vue"
import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATSideStepper,
    ATATFooter,
    ATATPageHead
  }
})

export default class App extends Vue {}

</script>
