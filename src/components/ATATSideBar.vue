<template>
  <v-navigation-drawer
    app
    clipped
    mini-variant-width="70"
    :mini-variant.sync="show"
    permanent
    class="global-side-nav-bar"
  >
    <v-list dense>
      <div class="d-flex flex-row">
        <v-subheader v-if="!show" class="font-weight-bold text-h6"
          >Menu</v-subheader
        >
        <div v-if="show" class="ml-auto d-flex flex-row">
          <v-img
            :src="require('../assets/greater than.svg')"
            contain
            height="30px"
            width="10px"
          ></v-img>
          <a
            class="font-weight-bold h6 text-decoration-underline mt-1 mx-1"
            @click.stop="show = !show"
          >
            Show
          </a>
        </div>
        <div v-else class="ml-auto d-flex flex-row">
          <v-img
            :src="require('../assets/less than.svg')"
            contain
            height="30px"
            width="10px"
          ></v-img>
          <a
            class="font-weight-bold h6 text-decoration-underline mt-1 mx-1"
            @click.stop="show = !show"
          >
            Hide
          </a>
        </div>
      </div>
      <v-divider></v-divider>
      <v-list-item-group v-if="!show" color="primary">
        <v-list-item v-for="(item, i) in items" :key="i" :ripple="false">
          <v-list-item-content>
            <router-link :to="item.link" v-slot="{ href, navigate, isActive }">
              <a class="body" :active="isActive" :href="href" @click="navigate">
                {{ item.text }}
              </a>
            </router-link>
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
  private show = true;

  private items = [
    { text: "Dashboard", link: "/createportfolio" },
    { text: "My Portfolios", link: "/portfolios" },
    { text: "Reports", link: "#" },
  ];
}
</script>
