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
        v-for="(navItem, navIdx) in topNavMenuItems"
        :key="navIdx"
        :offset-y="true"
        nudge-left="0"
        :id="'TopNavButton_' + navIdx"
        :attach="navItem.menu !== undefined"
        :left="navItem.align === 'left'"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            dark
            v-bind="attrs"
            v-on="on"
            :id="'TopNavBarItem_' + getIdText(navItem.title)"
            :class="{ '_profile': navItem.isProfile }"
          >
          {{ navItem.title }}
          <ATATSVGIcon
            v-if="navItem.menu && !navItem.isProfile"
            name="chevronDown" 
            color="white" 
            class="ml-2"
            :width="10" 
            :height="7" 
          />
          </v-btn>
        </template>

        <v-list 
          v-if="navItem.menu"
          class="_top-nav-menu"
          :class="{ '_profile-menu': navItem.isProfile }"
        >
          <template v-for="(menuItem, idx) in navItem.menu">
            <v-list-item
              v-if="navItem.isProfile && idx === 0"
              :key="'ProfileBlock' + idx"
              class="d-flex py-2"
              disabled
            >
              <div class="_initials mr-2">
                {{ navItem.title }}
              </div>
              <div style="line-height: 1.4">
                <div class="font-weight-700 font-size-14 text-base-darker">
                  {{ currentUser.firstName }} {{ currentUser.lastName }}
                </div>
                <div class="font-size-12 text-base">
                  {{ currentUser.email }}
                </div>

              </div>
              
            </v-list-item>
            <hr v-if="menuItem.separatorBefore" :key="'separator'+ idx" class="my-2" />

            <v-list-item
              :key="idx"
              :id="'TopNavBarMenuItem_' + getIdText(menuItem.title)"
            >
            
              <div v-if="menuItem.icon" class="text-center _menu-icon mr-2">
                <ATATSVGIcon
                  :name="menuItem.icon.name"
                  :color="menuItem.icon.color"
                  :width="menuItem.icon.width"
                  :height="menuItem.icon.height"
                />
              </div>
              <v-list-item-title>
                {{ menuItem.title }}
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </div>
    
  </v-system-bar>
</template>

<script lang="ts">
import { TopNavItems, User } from "types/Global";
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

  // TEMP hardcoded current user
  public currentUser: User = {
    firstName: "Maria",
    lastName: "Missionowner",
    email: "maria.missionowner.civ@mail.mil",
    role: "Manager",
  }

  public getUserInitials(): string {
    const firstI = this.currentUser.firstName?.charAt(0);
    const lastI = this.currentUser.lastName?.charAt(0);
    const initials = firstI && lastI 
      ? firstI + lastI
      : "XX";
    return initials.toUpperCase();
  }

  private topNavMenuItems: TopNavItems[] = []

  public getIdText(str: string): string {
    return getIdText(str);
  }

  public async loadOnEnter(): Promise<void> {
    this.topNavMenuItems = [
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
        menu: [
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
        title: this.getUserInitials(),
        isProfile: true,
        align: "left",
        menu:[
          { 
            title: "Profile",
            separatorBefore: true,
            icon: {
              name: "person",
              width: "14",
              height: "15",
              color: "base-dark",
            }        
          },
          { 
            title: "Contact Support",
            icon: {
              name: "contactSupport",
              width: "17",
              height: "20",
              color: "base-dark",
            }        
          },
          { 
            title: "Submit Feedback",
            icon: {
              name: "feedback",
              width: "18",
              height: "17",
              color: "base-dark",
            }        
          },
          { 
            title: "Sign out", 
            separatorBefore: true,
            icon: {
              name: "signOut",
              width: "18",
              height: "15",
              color: "base-dark",
            }        
          },
        ]
      }      
    ];
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
