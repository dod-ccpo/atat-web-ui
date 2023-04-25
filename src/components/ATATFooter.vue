<template>
  <div class="width-100">
    <v-footer class="atat-page-footer container-max-width">
      <div class="links">
        <!-- TODO: restore in future ticket
        <a href="#" class="_text-link">Security Notice</a>
        <a href="#" class="_text-link">Privacy</a>
        <a href="#" class="_text-link">Accessibility</a> 
        -->
      </div>
      <div>
        Last login: {{currentUser.last_login_time}}
      </div>
    </v-footer>
    <div v-if="allowDeveloperNavigation()" class="container-max-width">
      <hr />
      <div class="d-flex mb-10">

        <v-switch 
          id="developerToggleButton"
          v-model="developerNavState"
          label="Developer Navigation"
          class="mr-10"
          color="indigo"
          inset
        >
        </v-switch>

        <v-switch 
          id="productionToggleButton"
          v-model="prodContent"
          label="Production Content"
          color="indigo"
          inset
        >
        </v-switch>
      </div>
    </div>
  </div>    
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import UserStore from "@/store/user";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";
import AcquisitionPackage from "@/store/acquisitionPackage";

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

  private allowDeveloperNavigation(): boolean {
    return process.env.VUE_APP_allowDeveloperNavigation === 'true' || false;
  }

  public developerNavState = false; 
  @Watch("developerNavState")
  public developerNavStateChanged(newVal: boolean): void {
    AcquisitionPackage.setAllowDeveloperNavigation(newVal);
  }

  public prodContent = false;
  @Watch("prodContent")
  public async prodContentChanged(newVal: boolean): Promise<void> {
    await AcquisitionPackage.setEmulateProdNav(newVal);
  }

  public async loadOnEnter(): Promise<void> {
    this.currentUser = await UserStore.getCurrentUser();
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  }

}
</script>
