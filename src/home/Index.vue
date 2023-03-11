<template>
  <div 
    class="_home-wrapper"
    :class="[
      {'_is-new-user' : isNewUser },
      {'_is-existing-user' : !isNewUser }
    ]"  
  >
    <ATATToast />

    <div class="_hero-banner"></div>
    <v-main class="_home">
      <div class="_home-content">
        <div class="container-max-width">
          <div v-if="!isNewUser" class="_welcome-bar">
            <div class="d-flex justify-start">
              <h1 class="text-primary">
                Hi {{currentUser.first_name}}! How can we help you?
              </h1>
            </div>
            <div class="d-flex justify-end">
              <v-btn 
                class="v-btn primary"
                @click="startNewAcquisition"
              >
                Start a new acquisition
              </v-btn>
            </div>
          </div>
          <section v-if="isNewUser" class="_py-80">
            
            <div class="d-flex flex-row-reverse">
              <div class="d-flex align-flex-end">       
                <div class="bg-white border-rounded-more pa-8">
                  <h1 class="text-primary">Hi {{currentUser.first_name}}! How can we help you?</h1>
                  <br />
                  <div class="d-flex">
                    <v-btn
                      class="v-btn primary mr-4"
                      @click="startNewAcquisition"
                    >
                      Start a new acquisition
                    </v-btn>
                    <v-btn
                      href="https://community.hacc.mil/s/jwcc"
                      target="_blank"
                      id="HelpfulResourcesButton"
                      class="secondary no-text-decoration"
                      @click="scrollToResources"
                    >
                      Learn more about JWCC&nbsp;<v-icon>launch</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <NewUser 
          v-if="isNewUser" 
          class="mt-15" 
          @startNewAcquisition="startNewAcquisition" 
        />

        <ExistingUser 
          v-else 
          class="mt-8" 
          @startNewAcquisition="startNewAcquisition" 
          @allPackagesCleared="isNewUser = true"
        />      

        <div class="bg-white">
          <ATATFooter class="mx-auto pt-10" />
        </div>

      </div>

    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import ATATFooter from "@/components/ATATFooter.vue";
import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";
import ATATToast from "@/components/ATATToast.vue";

import HelpfulResourcesCards from "./components/HelpfulResourcesCards.vue";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";

import { scrollToId } from "@/helpers";

import UserStore from "@/store/user";
import AcquisitionPackage from "@/store/acquisitionPackage";
import { UserDTO } from "@/api/models";
import CurrentUserStore from "@/store/user";

@Component({
  components: {
    ATATFooter,
    ATATToast,
    ExistingUser,
    HelpfulResourcesCards,
    NewUser,
  }
})

export default class Home extends Vue {
  public isNewUser = false;

  private currentUser: UserDTO = {};

  public get getCurrentUser(): UserDTO {
    return CurrentUserStore.currentUser;
  }

  @Watch("getCurrentUser")
  public async currentUserChange(newVal: UserDTO): Promise<void> {
    this.currentUser = newVal;
    await this.checkIfIsNewUser();
  }  

  public scrollToResources(): void {
    scrollToId("HelpfulResourcesCards");
  }

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    await AcquisitionPackage.reset();
    this.$router.push({
      name: routeNames.ContractingShop,
      params: {
        direction: "next"
      },
      replace: true
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  public async checkIfIsNewUser(): Promise<void> {
    const userHasPackages = await UserStore.hasPackages();
    this.isNewUser = !userHasPackages;
  }

  public async mounted(): Promise<void> {
    await AcquisitionPackage.setHideNavigation(false);
    this.currentUser = await UserStore.getCurrentUser();
    await this.checkIfIsNewUser();
    const sectionData = await AppSections.getSectionData();
    AcquisitionPackage.doSetCancelLoadDest(sectionData.sectionTitles.Home);
  }

}

</script>
