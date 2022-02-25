<template>
<v-app-bar app flat>

  <div class="d-flex justify-space-between width-100">
    <div><h4>{{ headline }}</h4></div>
    <div class="d-flex justify-end">
      <v-btn icon class="mr-5 icon-24">
        <v-icon>person_add_alt_1</v-icon>
      </v-btn>
      <v-btn icon class="icon-24">
        <v-icon>more_horiz</v-icon>
      </v-btn>
    </div>
  </div>
<!--   
  <v-card
    color="white"
    flat
    width="100%"
  >
    <v-toolbar flat>
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>person_add_alt_1</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>more_horizontal</v-icon>
      </v-btn>
    </v-toolbar>
  </v-card> -->
</v-app-bar>
  <!-- <v-app-bar app flat class="bg-white d-flex justify-space-between">
    <template #default>
    <div>
      <h4>{{ headline }}</h4>
    </div>
    <div>
      <v-btn
        icon
        :ripple="false"
        :id="addPersonButton"
        aria-label="Action Menu"
      >
        <v-icon>person_add_alt_1</v-icon>
      </v-btn>
      <v-btn icon :ripple="false" :id="menuButton" aria-label="Action Menu">
        <v-icon>more_horizontal</v-icon>
      </v-btn>
    </div>
    </template>
  </v-app-bar> -->
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
@Component({})
export default class ATATPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;
}
</script>
