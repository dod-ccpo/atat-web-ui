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
        :id="'TopNavBarMenu_' + (!navItem.isProfile ? getIdText(navItem.title) : 'User')"
        :attach="navItem.menu !== undefined"
        :left="navItem.align === 'left'"
      >
        <!-- top nav bar items (buttons) -->
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            dark
            v-bind="attrs"
            v-on="on"
            :id="'TopNavButton_' + (!navItem.isProfile ? getIdText(navItem.title) : 'User')"
            :class="[
              { _profile: navItem.isProfile },
              { _active: isMenuItemActive(navItem) },
            ]"
            @click="navClicked(navItem)"
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

        <!-- menu items (dropdown menu) -->
        <v-list
          attach
          v-if="navItem.menu"
          class="_top-nav-menu"
          :class="{ '_profile-menu': navItem.isProfile }"
        >
          <template v-for="(menuItem, idx) in navItem.menu">
            <!-- top profile block with initials in circle, name, and email -->
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
                  {{ currentUser.first_name }} {{ currentUser.last_name }}
                </div>
                <div class="font-size-12 text-base">
                  {{ currentUser.email }}
                </div>
              </div>
            </v-list-item>

            <hr
              v-if="menuItem.separatorBefore"
              :key="'separator' + idx"
              class="my-2"
            />

            <!-- drop menu items -->
            <v-list-item
              :key="idx"
              :id="'TopNavBarMenuItem_' + getIdText(menuItem.title)"
              @click="navClicked(menuItem)"
              :class="[
                { _active: isMenuItemActive(menuItem) }, 
                { 'd-block pt-2 pb-1' : menuItem.subtitle } 
              ]"
            >
              <div class="d-flex align-center width-100">
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
                <div v-if="menuItem.externalUrl">
                  <ATATSVGIcon 
                    name="externalLink"
                    color="primary"
                    width="14"
                    height="16"
                  />
                </div>
              </div>
              <span 
                v-if="menuItem.subtitle" 
                class="d-block font-size-14 text-base pr-8"
                style="margin-left: 25px;"
              >
                {{ menuItem.subtitle }}
              </span>

            </v-list-item>
          </template>
        </v-list>
      </v-menu>
    </div>
  </v-system-bar>
</template>

<script lang="ts">
import { TopNavItem, User } from "types/Global";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import { getUserInitials } from "@/helpers";

import { getIdText } from "@/helpers";
import AppSections from "@/store/appSections";
import UserStore from "@/store/user";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    ATATSVGIcon,
  },
})
export default class ATATTopNavBar extends Vue {

  public currentUser: UserDTO = {}

  public get userInitials(): string {
    return this.getUserInitials({
      firstName: this.currentUser.first_name,
      lastName: this.currentUser.last_name
    })
  };

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public currentUserChange(newVal: UserDTO): void {
    this.currentUser = newVal;
    this.buildMenu();
  }  

  public activeMenuItems: string[] = [];

  public isMenuItemActive(item: TopNavItem): boolean {
    if (this.activeMenuItems.indexOf(item.title) > -1) {
      return true;
    }
    return false;
  }
  private topNavMenuItems: TopNavItem[] = [];

  public navClicked(item: TopNavItem): void {
    if (item.menu === undefined) {
      if (item.spaSectionTitle) {
        // only make menu item(s) active when navigating within the SPA
        this.activeMenuItems = [item.title];
        if (item.parentTitle) {
          this.activeMenuItems.push(item.parentTitle);
        }
        AppSections.changeActiveSection(item.spaSectionTitle);
      } else if (item.externalUrl) {
        // open external URL in new tab
        window.open(item.externalUrl, "_blank");
      } else if (item.link) {
        // open URL in same tab
        window.location.href = item.link;
      }
    }
  }

  public getUserInitials(member:User): string {
    return getUserInitials(member)
  }

  public getIdText(str: string): string {
    return getIdText(str);
  }

  public get logoutLink(): string {
    return window.location.origin + "/logout.do";
  }

  public async buildMenu(): Promise<void> {
    const sectionData = await AppSections.getSectionData();
    this.topNavMenuItems = [
      {
        title: "Dashboard",
        spaSectionTitle: sectionData.sectionTitles.Home,
      },
      {
        title: "Acquisitions",
        spaSectionTitle: sectionData.sectionTitles.Packages,
        // menu: [
        //   {
        //     title: "My Packages",
        //     parentTitle: "Acquisitions",
        //     spaSectionTitle: sectionData.sectionTitles.Packages,
        //   },
        //   {
        //     title: "My Task Orders",
        //     parentTitle: "Acquisitions",
        //   },
        //   { 
        //     title: "Document Review", 
        //     separatorBefore: true,
        //     parentTitle: "Acquisitions",
        //     spaSectionTitle: sectionData.sectionTitles.DocumentReview,
        //   },
        // ]
      },
      // {
      //   title: "Portfolios",
      //   spaSectionTitle: sectionData.sectionTitles.Portfolios,
      // },
      // {
      //   title: "Portals",
      //   align: "left",
      //   menu: [
      //     {
      //       title: "Global Service Desk",
      //       icon: {
      //         name: "person",
      //         width: "14",
      //         height: "15",
      //         color: "base-dark",
      //       },
      //     },
      //     {
      //       title: "Mission Partner Portal",
      //       icon: {
      //         name: "support",
      //         width: "18",
      //         height: "17",
      //         color: "base-dark",
      //       },
      //     },
      //   ],
      // },
      {
        title: "Help & Support",
        align: "left",
        menu: [
          {
            title: "JWCC Help Center",
            externalUrl: "https://community.hacc.mil/s/jwcc/resources",
            icon: {
              name: "support",
              width: "17",
              height: "17",
              color: "base-dark"
            }
          },
          {
            title: "Customer Support",
            subtitle: "Get answers about ATAT and DAPPS",
            externalUrl: "https://community.hacc.mil/s/contact?RequestTopic=Account%20Tracking%20" +
              "and%20Automation%20Tool%20%28ATAT%29&RoleType=Customer",
            icon: {
              name: "contactSupport",
              width: "16",
              height: "19",
              color: "base-dark"
            }
          },
          {
            title: "Technical Support",
            subtitle: "Report bugs or technical issues",
            externalUrl: "https://services.disa.mil/sp?" + 
              "id=sc_cat_item&sys_id=20e86845dbaf19148c045e8cd39619d9&" + 
              "sysparm_category=a30a5ca3db12a0508c045e8cd396197c",
            icon: {
              name: "bugReport",
              width: "14",
              height: "15",
              color: "base-dark"
            }
          }
        ]
      },
      {
        title: this.userInitials,
        isProfile: true,
        align: "left",
        menu: [
          // TODO: restore to profile menu in future ticket
          // {
          //   title: "Profile",
          //   separatorBefore: true,
          //   icon: {
          //     name: "person",
          //     width: "14",
          //     height: "15",
          //     color: "base-dark",
          //   },
          // },
          // {
          //   title: "Contact Support",
          //   icon: {
          //     name: "contactSupport",
          //     width: "17",
          //     height: "20",
          //     color: "base-dark",
          //   },
          // },
          // {
          //   title: "Submit Feedback",
          //   icon: {
          //     name: "feedback",
          //     width: "18",
          //     height: "17",
          //     color: "base-dark",
          //   },
          // },          
          {
            title: "Sign out",
            separatorBefore: true,
            link: this.logoutLink,
            icon: {
              name: "signOut",
              width: "18",
              height: "15",
              color: "base-dark",
            },
          },
        ],
      },
    ];    
  }

  public async loadOnEnter(): Promise<void> {
    this.buildMenu();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}
</script>
