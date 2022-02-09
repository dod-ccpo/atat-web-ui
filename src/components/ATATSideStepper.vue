<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="350"
  >
    <v-list>
      <v-list-item>
        <router-link to="/">Step 1</router-link>
      </v-list-item>
      <v-list-item>
          <router-link to="/steptwo">Step 2</router-link>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class ATATSideStepper extends Vue {}
</script>
