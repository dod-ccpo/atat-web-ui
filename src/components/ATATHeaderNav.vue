<template>
  <div class="atat-header-nav" id="atat-nav__login">
    <v-btn class="atat-header-nav__link atat-header-nav__user-display-name">
      <span>Maria Missionowner</span>
    </v-btn>
    <v-btn class="atat-header-nav__link atat-header-nav__support">
      <span>Support</span>
    </v-btn>
    <v-btn class="atat-header-nav__link atat-header-nav__logout">
      <span>Logout</span>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

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
  @Prop({ default: false }) private loginStatus = false;

  get navData(): Nav {
    if (this.loginStatus) {
      return all_navs["login"];
    }
    return all_navs["logout"];
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
      span {
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
          background-image: url("../../public/img/icons/user.svg");
          color: #f0f0f0;
          fill: #f0f0f0;
        }
      }
    }
    &.atat-header-nav__support {
      span::before {
        background-image: url("../../public/img/icons/question.svg");
      }
    }
    &.atat-header-nav__logout{
      &.v-btn:not(.v-btn--round).v-size--default {
        padding-left: 0px;
      }
      margin-right: 10px;
      padding-right: 25px;

      span {
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
          background-image: url("../../public/img/icons/logout.svg");
          color: #f0f0f0;
          fill: #f0f0f0;
        }
      }
    }
  }
}
</style>
