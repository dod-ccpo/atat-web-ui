<template>
  <v-footer class="atat-page-footer container-max-width">
    <div class="links">
      <a href="#" class="_text-link">Security Notice</a>
      <a href="#" class="_text-link">Privacy</a>
      <a href="#" class="_text-link">Accessibility</a>
    </div>
    <div>
      Last login: {{lastLoginTime}}
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import UserStore from "@/store/user";
@Component({})
export default class ATATFooter extends Vue {

  private lastLoginTime = "Sept. 3, 2020 1616-0400";

  public async loadOnEnter(): Promise<void> {
    const currentUser = await UserStore.getCurrentUser();
    this.lastLoginTime = currentUser.last_login_time as string;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
