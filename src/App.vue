<template>
  <v-app>
    <v-app-bar app color="primary_darken" clipped-left>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <atat-sidebar v-show="loginStatus" />
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <atat-footer />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }
}
</script>
