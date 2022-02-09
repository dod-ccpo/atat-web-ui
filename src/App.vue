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


<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-main__wrap {
  background-color: #fbfbfb; /* DISA Off-white */
  padding: 40px 56px;
  text-align: left;
}
</style>
