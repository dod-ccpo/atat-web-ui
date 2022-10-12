<template>
  <div id="HelpfulResourcesCards" class="_resources">
    <div class="container-max-width">
      <h3 class="mb-4">Helpful Resources</h3>
      <v-row>
        <v-col>
          <v-card flat>
            <h3>JWCC</h3>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
        <v-col>
          <v-card flat>
            <h3>DAPPS</h3>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
        <v-col>
          <v-card flat>
            <h3>ATAT</h3>
            <p>Short description of the resource topic</p> 
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class HelpfulResourcesCards extends Vue {}

</script>