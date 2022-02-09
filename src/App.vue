<template>
  <v-app>
    <ATATSideStepper />
    <v-main id="app">
      <router-view></router-view>
      <div class="content-max-width">
        <h1>Main content</h1>
        <p>Replace this div with <pre>&lt;router-view /&gt;</pre></p>
        <v-row>
          <v-col class="col-sm-6 col-md-8">
            <ATATAutoComplete />
          </v-col>
        </v-row>
      </div>
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import ATATAutoComplete from './components/ATATAutoComplete.vue'
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATFooter from "./components/ATATFooter.vue";
import { Component } from "vue-property-decorator";
@Component({
  components: {
    ATATAutoComplete,
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
