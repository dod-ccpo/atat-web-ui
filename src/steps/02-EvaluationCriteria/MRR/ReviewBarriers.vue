<template>
  <v-form ref="form" lazy-validation>
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="mb-3">
            Let’s review your agency’s plans to remove barriers to fair opportunity
          </h1>
          <p>
            Intro paragraph
          </p>
        </v-col>
      </v-row>
    </v-container>    
  </v-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class ReviewBarriers extends Vue {}
</script>