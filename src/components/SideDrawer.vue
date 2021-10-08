<template>
  <v-slide-x-reverse-transition>
    <v-navigation-drawer
      v-if="isSideDrawerOpen"
      :width="drawerWidth + 'px'"
      id="right-side-drawer"
      app
      clipped
      :temporary="showOverlay"
      permanent
      right
      tabindex="3"
      :style="{
        height: getHeight,
        'max-height': getHeight,
        'min-height': getHeight,
      }"
    >
      <div
        class="
          ml-auto
          d-flex
          align-center
          justify-space-between
          width-100
          py-5
          pl-6
        "
      >
        <div class="font-weight-bold body">{{ getTitle }}</div>
        <div class="pr-7">
          <v-btn
            class="text--base-darkest h6 pa-0 icon-24"
            tabindex="3"
            text
            small
            @click.stop="hide"
            ref="drawerCloserRef"
            id="drawerCloser"
            :ripple="false"
          >
            <v-icon class="icon-20">close</v-icon>
          </v-btn>
        </div>
      </div>
      <ProfileDrawer
        v-if="sideDrawerType === 'profile'"
        :drawerWidth="drawerWidth"
        :drawerHeight="getHeight"
      ></ProfileDrawer>
      <SubmitDrawer
        v-if="sideDrawerType === 'submit'"
        :drawerWidth="drawerWidth"
        :drawerHeight="getHeight"
      ></SubmitDrawer>
      <TeamMemberRolesDrawer
        v-if="sideDrawerType === 'teammemberroles'"
        :drawerWidth="drawerWidth"
        :drawerHeight="getHeight"
        :showScrollbar.sync="showScrollbar"
        class="scrollable-content"
      ></TeamMemberRolesDrawer>
    </v-navigation-drawer>
  </v-slide-x-reverse-transition>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import ProfileDrawer from "./SideDrawerComponents/ProfileDrawer.vue";
import SubmitDrawer from "./SideDrawerComponents/SubmitDrawer.vue";
import TeamMemberRolesDrawer from "./SideDrawerComponents/TeamMemberRolesDrawer.vue";

// document.getElementById("right-side-drawer").o;

@Component({
  components: {
    ProfileDrawer,
    SubmitDrawer,
    TeamMemberRolesDrawer,
  },
})
export default class SideDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  private showScrollbar = false;

  get sideDrawerType(): string {
    return this.$store.state.sideDrawerType;
  }

  get getTitle(): string {
    let title = "";
    switch (this.sideDrawerType) {
      case "profile":
        title = "Your Profile";
        break;
      case "submit":
      case "teammemberroles":
        title = "Learn More";
        break;
      default:
        break;
    }
    return title.toUpperCase();
  }

  get getHeight(): string {
    // const drawerHeight = window.innerHeight;
    // return drawerHeight + "px";
    return '100vh';
  }

  get isSideDrawerOpen(): boolean {
    const _isSideDrawerOpen = this.$store.state.sideDrawer;
    setTimeout(() => {
      if (_isSideDrawerOpen && this.showOverlay) {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.addEventListener("click", this.hide);
      } else {
        document
          .getElementsByClassName("v-overlay--active")[0]
          ?.removeEventListener("click", this.hide);
      }
    }, 0);

    return _isSideDrawerOpen;
  }

  get showOverlay(): boolean {
    return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
  }

  get getScrollbar(): string {
    return this.showScrollbar ? "expandedSidebarDiv" : "";
  }

  @Watch("$store.state.isSideDrawerFocused")
  setFocus(newVal: boolean): void {
    if (newVal && this.isSideDrawerOpen) {
      setTimeout(function () {
        document.getElementById("drawerCloser")?.focus();
      }, 500);
    }
  }


  //todo get rid of this..
  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeSideDrawer");
  }
}
</script>

<style>
.expandedSidebarDiv {
  overflow-y: auto !important;
  height: calc(100% - 237px) !important;
  overflow-x: hidden !important;
}
.scrollable-content {
  flex-grow: 1;  
  overflow: auto;
}
</style>
