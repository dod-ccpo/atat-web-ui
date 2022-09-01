<template>
  <v-system-bar id="topNavBar" app flat>
    <div class="d-flex justify-end width-100">
      <v-menu
        v-for="(item, idx) in topNavMenuItems"
                :key="idx"
         :offset-y="true"
          nudge-left="0"
          nudge-top="0"
          :id="'topNavButton_' + idx"
          attach
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                dark
                v-bind="attrs"
                v-on="on"
                :id="'topNavBarItem_' + idx"
              >
                {{ item.title }}
              </v-btn>
            </template>

            <v-list class="topNavMenu">
              <v-list-item
                 v-for="(item, idx) in item.menu"
                :key="idx"
              >
                <v-list-item-title :id="'topNavBarMenuItem_' + idx">
                  {{ item.title }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
    </v-system-bar>
</template>

<script lang="ts">
import { TopNavItems } from "types/Global";
import Vue from "vue";
import { Component} from "vue-property-decorator";

@Component({})

export default class ATATTopNavBar extends Vue {

  private topNavMenuItems: TopNavItems = [
    {
      title: "Dashboard",
      menu:[
        { title: "menu item 0001"},
        { title: "menu item 0002"},
        { title: "menu item 0003"}
      ]
    },
    {
      title: "Acquisitions",
    },
    {
      title: "Portfolios",
    },
    {
      title: "Portals",
    },
    {
      title: "Profile",
    }
  ]

}
</script>
