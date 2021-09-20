<template>
  <v-navigation-drawer
    app
    clipped
    mini-variant-width="0"
    :mini-variant.sync="profile"
    permanent
    right
  >
    <v-list dense>
      <div class="d-flex flex-row">
        <v-subheader v-if="!profile" class="font-weight-bold text-h6"
          >Menu</v-subheader
        >
        <div v-if="profile" class="ml-auto d-flex align-center">
          <v-img
            :src="require('../assets/greater than.svg')"
            contain
            height="30px"
            width="10px"
          ></v-img>
          <v-btn
            class="text--primary link-button h6 pa-0 ma-0 ml-1"
            @click.stop="profile = !profile"
            plain
            x-small
            tabindex="3"
            :ripple="false"
          >
            <span class="font-weight-bold"> Show </span>
          </v-btn>
        </div>
        <div v-else class="ml-auto d-flex align-center">
          <v-img
            :src="require('../assets/less than.svg')"
            contain
            height="30px"
            width="10px"
          ></v-img>
          <v-btn
            class="text--primary link-button h6 pa-0 ma-0 ml-1"
            tabindex="3"
            plain
            x-small
            @click.stop="profile = !profile"
            :ripple="false"
          >
            <span class="font-weight-bold"> Hide </span>
          </v-btn>
        </div>
      </div>
      <v-divider></v-divider>
      <template>
        <router-link
          v-for="(item, i) in items"
          :key="i"
          :to="item.link"
          v-slot="{ href, navigate, isActive }"
          tabindex="0"
        >
          <v-btn
            v-if="!profile"
            tabindex="2"
            class="body left-nav-menu-link d-flex justify-start"
            :active="isActive"
            :href="href"
            :ripple="false"
            @click="navigate"
            :retain-focus-on-click="true"
          >
            {{ item.text }}
          </v-btn>
        </router-link>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({})
export default class RightSideDrawer extends Vue {
  private profile = false;

  private items = [
    { text: "Dashboard", link: "/createportfolio" },
    { text: "My Portfolios", link: "/portfolios" },
    { text: "Reports", link: "#" },
  ];
}
</script>
