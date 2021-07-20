<template>
  <div class="atat-header-nav my-1" :id="navData.id" :title="navData.title">
    <v-btn
      v-for="item in navData.items"
      :id="item.cssClass"
      :title="item.title"
      @click="itemCLicked(item)"
      :key="item.id"
      :ripple="false"
      class="px-0 mr-4 ml-4 primary_darken"
      small
      text
    >
      <v-icon v-show="item.iconPlacement === 'left'" left>
        {{ item.icon }}
      </v-icon>
      {{ item.title }}
      <v-icon v-show="item.iconPlacement === 'right'" right>
        {{ item.icon }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Navs, Nav, NavItem } from "../../types/NavItem";

@Component({})
export default class ATATHeaderNav extends Vue {
  //data
  private all_navs: Navs = {
    logout: {
      id: "atat-nav__logout",
      title: "logout Nav",
      items: [],
    },
    login: {
      id: "atat-nav__login",
      title: "login Nav",
      items: [
        {
          id: 1,
          cssClass: "atat-header-nav__user-display-name",
          title: "Maria Missionowner",
          url: "#",
          newWindow: false,
          icon: "mdi-account-circle",
          iconPlacement: "left",
        },
        {
          id: 2,
          cssClass: "atat-header-nav__support",
          title: "Support",
          url: "#",
          newWindow: false,
          icon: "mdi-help-circle-outline",
          iconPlacement: "left",
        },
        {
          id: 3,
          cssClass: "atat-header-nav__logout",
          title: "Logout",
          url: "/",
          component: "logout-action",
          newWindow: false,
          icon: "mdi-logout",
          iconPlacement: "right",
        },
      ],
    },
  };

  //computed
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }

  get navData(): Nav {
    return this.loginStatus ? this.all_navs["login"] : this.all_navs["logout"];
  }

  //Methods
  private login(): void {
    this.$store.dispatch("login");
  }

  private logout(): void {
    this.$store.dispatch("logout");
  }

  //Events
  private itemCLicked(item: NavItem): void {
    if (item.component) {
      if (item.component === "logout-action") {
        this.logout();
      }
    }
    if (item.url) {
      this.$router.push(item.url);
    }
  }
}
</script>
