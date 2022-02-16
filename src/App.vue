<template>
  <v-app>
    <ATATSideStepper />
    <v-main id="app">
      <router-view></router-view>
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
@font-face {
  font-family: "League Gothic";
  src: local("League Gothic"),
  url(./fonts/League-Gothic/LeagueGothic-Regular.ttf) format("truetype")
}
</style>

<script lang="ts">
import Vue from "vue";
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATFooter from "./components/ATATFooter.vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATSideStepper,
    ATATFooter
  }
})

export default class App extends Vue {}

</script>
