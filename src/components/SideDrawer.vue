<template>
  <v-slide-x-reverse-transition>
    <v-navigation-drawer
      v-if="isSideDrawerOpen"
      :width="drawerWidth + 'px'"
      app
      clipped
      :temporary="showOverlay"
      permanent
      right
      v-click-outside="hide"
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
    </v-navigation-drawer>
  </v-slide-x-reverse-transition>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop, Watch } from "vue-property-decorator";
import ProfileDrawer from "./SideDrawerComponents/ProfileDrawer.vue";
import SubmitDrawer from "./SideDrawerComponents/SubmitDrawer.vue";
@Component({
  components: {
    ProfileDrawer,
    SubmitDrawer,
  },
})
export default class SideDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;

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
        title = "Learn More";
        break;
      default:
        break;
    }
    return title.toUpperCase();
  }

  get getHeight(): string {
    const drawerHeight = window.innerHeight;
    return drawerHeight + "px";
  }

  get isSideDrawerOpen(): boolean {
    return this.$store.state.sideDrawer;
  }

  get showOverlay(): boolean {
    return this.$vuetify.breakpoint.sm || this.$vuetify.breakpoint.xs;
  }

  @Watch("$store.state.isSideDrawerFocused")
  setFocus(newVal: boolean): void {
    if (newVal && this.isSideDrawerOpen) {
      setTimeout(function () {
        document.getElementById("drawerCloser")?.focus();
      }, 500);
    }
  }

  //method
  private hide(): Promise<boolean> {
    return this.$store.dispatch("closeSideDrawer");
  }
}
</script>
