<template>
  <v-app-bar app class="atat-header-nav" height="48" elevation="0">
    <div class="d-flex align-center justify-space-between pt-2 nav-header">
      <div class="d-flex  px-4">
        <p>Demo Package</p>

    <div class="mr-auto">
    <!-- <v-btn icon>
      <v-icon> person_add_alt_1</v-icon>
    </v-btn> -->

    <!-- <v-btn icon>
      <v-icon> more_horizontal</v-icon>
    </v-btn> -->
      </div>
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class ATATTopNav extends Vue {}
</script>
