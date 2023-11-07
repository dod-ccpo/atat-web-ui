<template>
  <v-container fluid class="container-max-width mx-auto">
    <v-row>
      <v-col>
        <v-footer class="_atat-page-footer">
          <div class="links">
            <!-- TODO: restore in future ticket
            <a href="#" class="_text-link">Security Notice</a>
            <a href="#" class="_text-link">Privacy</a>
            <a href="#" class="_text-link">Accessibility</a> 
            -->
          </div>
          <div class="footer-content">
            <div>Last login: {{getCurrentUser.last_login_time}}</div>
            <div>Version: {{VERSION}}</div>
          </div>
        </v-footer>
        <div v-if="allowDeveloperNavigation()" style="height:300px">
          <hr />
          <div class="d-flex mb-10">

            <v-switch 
              id="developerToggleButton"
              v-model="developerNavState"
              label="Developer Navigation"
              class="mr-10"
              color="indigo"
              :inset="true"
            >
            </v-switch>

            <v-switch 
              id="productionToggleButton"
              v-model="prodContent"
              label="Production Content"
              color="indigo"
              :inset="true"
            >
            </v-switch>
          </div>
        </div>
      </v-col>
    </v-row>

  </v-container>    
</template>

<script lang="ts">
import { Watch, Component, Vue, toNative } from "vue-facing-decorator";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";
import AcquisitionPackage from "@/store/acquisitionPackage";


@Component({})

class ATATFooter extends Vue {
  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.getCurrentUserData;
  }
  public get VERSION(): string | undefined {
    return process.env.VERSION;
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
}
export default toNative(ATATFooter)
</script>

<style scoped>
.footer-content {
  text-align: right;
}
</style>
