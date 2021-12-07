<template>
  <div class="atat-info-side-drawer">
    <v-divider></v-divider>
    <div
      class="body-lg mx-6 text--base-darkest"
      :style="{
        height: scrollableDivHeight + 'px !important',
        maxheight: scrollableDivHeight + 'px !important',
        minheight: scrollableDivHeight + 'px !important',
      }"
    >
      <h2 class="mb-5 mt-4">
        Understanding member roles within your cloud console
      </h2>

      <about-member-role-content />

    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync } from "vue-property-decorator";
import AboutMemberRoleContent from "@/components/SideDrawerComponents/AboutMemberRoleContent.vue";

@Component({
  components: {
    "about-member-role-content": AboutMemberRoleContent,
  },
})
export default class TeamMemberRolesDrawer extends Vue {
  @Prop({ default: "400" }) private drawerWidth!: string;
  @Prop({ default: "400" }) private drawerHeight!: string;
  @Prop() private scrollableDivHeight!: number;
}
</script>
