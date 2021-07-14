<template>
  <div class="atat-header-nav" :id="navData.id" :title="navData.title">
    <v-btn
      class="atat-header-nav__link"
      v-for="item in navData.items"
      :class="item.cssClass"
      :id="item.cssClass"
      :title="item.title"
      :to="item.url"
      :key="item.id"
    >
      <span>{{ item.title }}</span>
    </v-btn>

<!--    <pre>-->
<!--      loginStatus: {{ loginStatus }}-->
<!--      navData: {{ navData }}-->

<!--    </pre>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

export interface NavItem {
  title: string;
  url?: string;
  component?: string;
  cssClass?: string;
  newWindow?: string | boolean; // = false | true
  children?: NavItem[]; // = [];
  order?: number;
  attachment?: number;
  parentIndex?: number;
  uuid?: number;
  id?: number;
}
export interface Meta {
  key: string;
  value: string;
}
export interface Nav {
  id: string;
  title: string;
  items: NavItem[];
  meta?: Meta[];
}
export interface Navs {
  [key: string]: Nav;
}

// simulating nav connection
const all_navs: Navs = {
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
      },
      {
        id: 2,
        cssClass: "atat-header-nav__support",
        title: "Support",
        url: "#",
        newWindow: false,
      },
      {
        id: 3,
        cssClass: "atat-header-nav__logout",
        title: "Logout",
        url: "#",
        component: "logout-action",
        newWindow: false,
      },
    ],
  },
};

@Component({})
export default class ATATHeaderNav extends Vue {
  get loginStatus(): boolean {
    return this.$store.getters.getLoginStatus;
  }

  get navData(): Nav {
    if (this.loginStatus) {
      return all_navs["login"];
    } else {
      return all_navs["logout"];
    }
  }

  private login(): void {
    console.log("action login");
    this.$store.dispatch("login");
  }
  private logout(): void {
    console.log("action logout");
    this.$store.dispatch("logout");
  }
}
</script>
<style lang="scss">
.atat-header-nav {
  .atat-header-nav__link {
    border-radius: unset;

    &.v-btn:not(.v-btn--round).v-size--default {
      height: 0;
    }
    &.theme--light.v-btn.v-btn--has-bg {
      background-color: none;
    }
    &.theme--light.v-btn {
      color: #f0f0f0;
      font-family: Source Sans Pro;
      font-style: normal;
      font-weight: bold;
      font-size: 15px;
      line-height: 24px;
      text-transform: capitalize;
    }

    &.atat-header-nav__support,
    &.atat-header-nav__user-display-name {
      padding-left: 25px;
      color: #f0f0f0;
      > span:first-child {
        display: inline-block;
        position: relative;
        overflow: visible;
        color: #f0f0f0;
        &::before {
          content: " ";
          width: 16px;
          height: 16px;
          position: absolute;
          display: block;
          left: -24px;
          top: 3px;
          margin-right: 8px;
          background-position: top center;
          background-size: 16px 16px;
          background-image: url("../../public/img/icons/avatar_white.svg");
          color: #f0f0f0;
          fill: #f0f0f0;
        }
      }
    }
    &.atat-header-nav__support {
      > span:first-child::before {
        background-image: url("../../public/img/icons/help_white.svg");
      }
    }
    &.atat-header-nav__logout {
      &.v-btn:not(.v-btn--round).v-size--default {
        padding-left: 0px;
      }
      margin-right: 10px;
      padding-right: 25px;

      > span:first-child {
        display: inline-block;
        position: relative;
        overflow: visible;
        &::after {
          position: absolute;
          display: block;
          content: " ";
          margin-left: 8px;
          width: 16px;
          height: 16px;
          right: -24px;
          top: 3px;
          background-position: top center;
          background-size: 16px 16px;
          background-image: url("../../public/img/icons/logout_white.svg");
          background-repeat: no-repeat;
          color: #f0f0f0;
          fill: #f0f0f0;
        }
      }
    }
  }
}
</style>
