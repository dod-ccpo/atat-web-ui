<template>
  <v-container class="hello-world-component">
    <v-row class="text-center">
      <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" class="mb-4">
        <h1 class="h1 font-weight-bold mb-3">Hello World</h1>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12" class="mb-4">
        <v-icon large color="success"> mdi-domain </v-icon>
        <v-icon large color="primary"> mdi-message-text </v-icon>
        <a href="google.com" target="blank" class="link-body-lg"> google.com</a>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="4" offset="4" class="mb-4">
        <atat-select id="html-select-dummy" />
        <atat-text-field id="plain-text-box" />
        <atat-text-field :success="true" id="success" />
        <atat-text-field :error="true" id="error" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})
export default class StyledFields extends Vue {}
</script>
