<template>
  <v-app-bar 
    id="PageHeader" 
    app 
    flat 
    class="_atat-page-header"
  >
    <div class="d-flex justify-space-between width-100 align-center">
      <div id="PackageNameHeader" tabindex="-1" class="h3">{{ headline }}</div>
      <div class="d-flex justify-end align-center">
        <v-btn icon class="mr-5 icon-24 _header-button" id="Person_Button">
          <v-icon class="text-base-dark">person_add_alt_1</v-icon>
        </v-btn>

        <v-menu
          :offset-y="true"
          nudge-left="170"
          id="MoreMenu"
          class="_more-menu _header-menu"
          attach
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              v-bind="attrs"
              v-on="on"
              id="MoreMenuButton"
              class="_more-menu-button _header-button"
            >
              <v-icon class="text-base-dark">more_horiz</v-icon>
            </v-btn>
          </template>
    
          <v-list>
            <v-list-item
              v-for="(item, index) in moreMenuItems"
              :key="index"
              @click="moreMenuClick(index)"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>        
      </div>
    </div>
  </v-app-bar>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({})

export default class ATATPageHead extends Vue {
  @Prop({ default: "Headline" }) private headline!: string;

  public moreMenuOpen = false;

  moreMenuItems = [
    { title: "Acquisition Package Builder" },
    { title: "JWCC Dashboard" },
    { title: "Portfolio Dashboard" },
    { title: "Lookup TO in EDA" },
  ];


  public moreMenuClick(index: number): void {
    // debugger;
  }

}
</script>
