<template>
  <v-footer class="atat-page-footer container-max-width">
    <div class="links">
      <a href="#" class="_text-link">Security Notice</a>
      <a href="#" class="_text-link">Privacy</a>
      <a href="#" class="_text-link">Accessibility</a>
    </div>
    <div>
      Last login: {{currentUser.last_login_time}}
    </div>
  </v-footer>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import UserStore from "@/store/user";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";
@Component({})
export default class ATATFooter extends Vue {
  private currentUser: UserDTO = {};

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public currentUserChange(newVal: UserDTO): void {
    this.currentUser = newVal;
  }  

  public async loadOnEnter(): Promise<void> {
    this.currentUser = await UserStore.getCurrentUser();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
