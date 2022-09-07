<template>
  <v-system-bar id="TopNavBar" app flat>
    <ATATSVGIcon 
      color="white"
      width="110"
      height="38"
      name="disaLogo"
      class="pl-4 pt-1"
    />
    <div class="d-flex justify-end width-100">
      <v-menu
        v-for="(item, idx) in topNavMenuItems"
        :key="idx"
        :offset-y="true"
        nudge-left="0"
        :id="'TopNavButton_' + idx"
        attach
        :left="item.align === 'left'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            dark
            v-bind="attrs"
            v-on="on"
            :id="'TopNavBarItem_' + getIdText(item.title)"
            :class="{ '_profile': item.isProfile }"
          >
          {{ item.title }}
          <ATATSVGIcon
            v-if="item.menu && !item.isProfile"
            name="chevronDown" 
            color="white" 
            class="ml-2"
            :width="10" 
            :height="7" 
          />
          </v-btn>
        </template>

        <v-list class="_top-nav-menu">
          <v-list-item
            v-for="(item, idx) in item.menu"
            :key="idx"
            :id="'TopNavBarMenuItem_' + getIdText(item.title)"            
          >
            <div v-if="item.icon" class="text-center _menu-icon mr-2">
              <ATATSVGIcon
                :name="item.icon.name"
                :color="item.icon.color"
                :width="item.icon.width"
                :height="item.icon.height"
              />
            </div>
            <v-list-item-title>
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
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import { getIdText } from "@/helpers";

@Component({
  components: {
    ATATSVGIcon,
  },
})

export default class ATATTopNavBar extends Vue {

  private topNavMenuItems: TopNavItems[] = [
    {
      title: "Dashboard",
    },
    {
      title: "Acquisitions",
      menu:[
        { title: "My Packages" },
        { title: "My Task Orders" },
      ]
    },
    {
      title: "Portfolios",
    },
    {
      title: "Portals",
      align: "left",
      menu:[
        { 
          title: "Global Service Desk",
          icon: {
            name: "person",
            width: "14",
            height: "15",
            color: "base-dark",
          }        
        },
        { 
          title: "Mission Partner Portal",
          icon: {
            name: "support",
            width: "18",
            height: "17",
            color: "base-dark",
          }                
        },
      ]
    },
    {
      title: "MM",
      isProfile: true,
      align: "left",
      menu:[
        { title: "Profile"},
        { title: "Contact Support"},
        { title: "Submit Feedback"},
        { title: "Sign out"},
      ]
    }
  ]

  public getIdText(str: string): string {
    return getIdText(str);
  }

}
</script>
