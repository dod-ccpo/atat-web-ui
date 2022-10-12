<template>
  <!-- <div class="_hero-banner"> -->
    <!-- <div class="_hero-banner">
    </div> -->

    <v-main class="_home _hero-banner">
      <div class="_home-content">
        <div class="container-max-width">

          <div class="bg-white border-rounded py-6 px-8
            d-flex justify-space-between align-center"
          >
            <h1 class="text-primary">Hi Maria! How can we help you?</h1>
            <v-btn 
              :class="isNewUser ? 'secondary' : 'primary'"
              @click="scrollToResources"
            >
              Helpful Resources
            </v-btn>
          </div>
        </div>

        <div class="container-max-width mx-auto">

          <NewUser v-if="isNewUser" class="mt-15" />

          <ExistingUser v-else class="mt-15" />

          <a 
            role="button" 
            @click="isNewUser = !isNewUser" 
            class="mt-10 font-size-12 d-block mt-10"
          >
            Toggle new/existing for testing
          </a>

          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>
          <p>content to test scrolling</p>

        </div>

        <HelpfulResourcesCards :isNewUser="isNewUser" />

        <div class="bg-white">
          <ATATFooter class="mx-auto pt-10" />
        </div>

      </div>

    </v-main>
  <!-- </div> -->
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ATATFooter from "@/components/ATATFooter.vue";
import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";

import HelpfulResourcesCards from "./components/HelpfulResourcesCards.vue";

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

  public scrollToResources(): void {
    const resourcesEl = document.getElementById("HelpfulResourcesCards");
    if (resourcesEl) {
      resourcesEl.scrollIntoView({
        behavior: "smooth"
      });    
    }
  }

}

</script>
