<template v-slot:activator="{ on, attrs }">
  <v-navigation-drawer
    app
    clipped
    mini-variant-width="70"
    :mini-variant.sync="show"
    permanent
    class="global-side-nav-bar"
    v-bind="attrs"
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
          <v-btn
            class="font-weight-bold body link-button ma-0 pa-0"
            @click.stop="show = !show"
            outlined
            tabindex="3"
            v-bind="attrs"
            :ripple="false"
          >
            Show
          </v-btn>
        </div>
        <div v-else class="ml-auto d-flex flex-row">
          <v-img
            :src="require('../assets/less than.svg')"
            contain
            height="30px"
            width="10px"
          ></v-img>
          <v-btn
            class="font-weight-bold body link-button ma-0 pa-0"
            tabindex="3"
            outlined
            @click.stop="show = !show"
            v-bind="attrs"
            :ripple="false"
          >
            Hide
          </v-btn>
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
