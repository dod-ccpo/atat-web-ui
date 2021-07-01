<template>
  <v-app>
    <v-app-bar app color="primary_darken" elevate-on-scroll>
      <div class="d-flex align-center"></div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <!-- <v-navigation-drawer>
    </v-navigation-drawer> -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <atat-footer />
  </v-app>
</template>


<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class App extends Vue {}
</script>
