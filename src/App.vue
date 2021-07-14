<template>
  <v-app>
    <v-app-bar app color="primary_darken" clipped-left>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <atat-sidebar v-show="IsAuthenticated" />
    <v-main>
      <v-container fluid>
        <router-view @isAuthenticated="isAuthenticated"></router-view>
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
import { Component, Emit } from "vue-property-decorator";

@Component({})
export default class App extends Vue {
  private IsAuthenticated = false;
  
  private isAuthenticated() {
    this.IsAuthenticated = true;
    this.$router.push("/dashboard");
  }
}
</script>
