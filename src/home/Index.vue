<template>
  <div 
    class="_home-wrapper"
    :class="[
      {'_is-new-user' : isNewUser },
      {'_is-existing-user' : !isNewUser }
    ]"  
  >
    <div class="_hero-banner"></div>
    <v-main class="_home">
      <div class="_home-content">
        <div class="container-max-width">
          <section class="_py-80">
            <v-row>
              <v-col cols="6" offset="6">
                <div class="bg-base-lightest pa-6">
                  <h1 class="text-primary">Hi {{currentUser.first_name}}! How can we help you?</h1>
                  <br/>
                  <v-row>
                    <v-col cols="6">
                      <v-btn 
                        class="v-btn primary"
                        @click="startNewAcquisition"
                      >
                        Start a new acquisition
                      </v-btn>
                    </v-col>
                    <v-col cols="6">
                      <v-btn 
                        id="HelpfulResourcesButton"
                        class="secondary"
                        @click="scrollToResources"
                      >
                        Learn more about JWCC
                      </v-btn>
                    </v-col>
                  </v-row>                
                </div>
              </v-col>
            </v-row>
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
        />

        <HelpfulResourcesCards :isNewUser="isNewUser" />

        <div class="bg-white">
          <div class="container-max-width pt-5">
            <a 
              id="TempUserTypeToggle"
              role="button" 
              @click="toggleUserType" 
              class="font-size-12 d-block mb-10"
            >
              Toggle new/existing for testing
            </a>

          </div>
        </div>        

        <div class="bg-white">
          <ATATFooter class="mx-auto pt-10" />
        </div>

      </div>

    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATFooter from "@/components/ATATFooter.vue";
import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";

import HelpfulResourcesCards from "./components/HelpfulResourcesCards.vue";
import Steps from "@/store/steps";
import AppSections from "@/store/appSections";
import { routeNames } from "@/router/stepper";

import { scrollToId } from "@/helpers";

import UserStore from "@/store/user";

@Component({
  components: {
    ATATFooter,
    ExistingUser,
    HelpfulResourcesCards,
    NewUser,
  }
})

export default class Home extends Vue {
  public isNewUser = true;

  private currentUser = UserStore.getInitialUser;

  public scrollToResources(): void {
    scrollToId("HelpfulResourcesCards");
  }

  public async startNewAcquisition(): Promise<void> {
    await Steps.setAltBackDestination(AppSections.sectionTitles.Home);
    this.$router.push({
      name: routeNames.ProjectOverview,
      params: {
        direction: "next"
      }
    }).catch(() => console.log("avoiding redundant navigation"));
    AppSections.changeActiveSection(AppSections.sectionTitles.AcquisitionPackage);
  }

  // temporary method to swap New vs Existing users
  public toggleUserType(): void {
    this.isNewUser = !this.isNewUser;
    const el = document.querySelector(".v-main__wrap");
    if (el) {
      el.scrollTop = 0;
    }
  }

  public async mounted(): Promise<void> {
    this.currentUser = await UserStore.getCurrentUser();
  }

}

</script>
