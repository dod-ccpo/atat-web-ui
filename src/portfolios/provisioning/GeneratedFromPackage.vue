<template>
  <v-container fluid class="container-max-width">
    <v-row>
      <v-col>
        <h1 class="page-header">
          Was this task order generated from one of your existing packages?
        </h1>
        <p class="page-intro">
          Select one of your packages below, and we will update the status to 
          close this acquisition. If you obtained your task order outside of the 
          DISA Acquisition Package Preparation System (DAPPS), click the “I didn’t 
          use DAPPS for this task order” button to proceed.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class GeneratedFromPackage extends Vue {}
</script>
