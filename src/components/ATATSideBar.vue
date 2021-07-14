<template>
  <v-navigation-drawer app clipped :mini-variant.sync="show" permanent>
    <v-list dense>
      <v-subheader class="text-h6" @click.stop="show = !show">Menu</v-subheader>
      <v-divider></v-divider>
      <v-list-item-group v-if="!show" v-model="selectedItem" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i" :ripple="false">
          <v-list-item-content>
            <v-list-item-title v-text="item.text"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({})
export default class ATATSideBar extends Vue {
  data() {
    return {
      show: true,
      selectedItem: 0,
      items: [
        { text: "Dashboard" },
        { text: "My Portfolios" },
        { text: "Reports" },
      ],
    };
  }
}
</script>
t>

<style scoped></style>
