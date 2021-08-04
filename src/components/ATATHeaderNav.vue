<template>
  <div class="atat-header-nav mr-3" :id="navData.id" :title="navData.title">
    <v-btn
      v-for="item in navData.items"
      :id="item.cssClass"
      :title="item.title"
      @click="itemClicked(item)"
      :key="item.id"
      :ripple="false"
      class="px-0 mr-4 ml-4 primary_darken"
      small
      text
    >
      <v-icon v-show="item.iconPlacement === 'left'" left class="icon-20">
        {{ item.icon }}
      </v-icon>
      {{ item.title }}
      <v-icon v-show="item.iconPlacement === 'right'" right class="icon-20">
        {{ item.icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Nav, NavItem } from "../../types/NavItem";

@Component({})
export default class ATATHeaderNav extends Vue {
  //computed
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }

  get navData(): Nav {
    return this.$store.getters.getNavBarItems[
      this.loginStatus ? "login" : "logout"
    ];
  }

  //Methods
  private login(): void {
    this.$store.dispatch("login");
  }

  private logout(): void {
    this.$store.dispatch("logout");
  }

  //Events
  private itemClicked(item: NavItem): void {
    if (item.action && item.action.toLowerCase() === "logout") {
      this.logout();
    }

    if (item.url) {
      this.$router.push(item.url);
    }
  }
}
</script>
