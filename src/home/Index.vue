<template>
  <div>
    <div class="_hero-banner">
    </div>

    <v-main class="_home">
      <div class="_home-content">
        <div class="container-max-width">

        <div class="bg-white border-rounded py-6 px-8
          d-flex justify-space-between align-center"
        >
          <h1 class="text-primary">Hi Maria! How can we help you?</h1>
          <v-btn 
            id="HelpfulResourcesButton"
            :class="isNewUser ? 'secondary' : 'primary'"
            @click="scrollToResources"
          >
            Helpful Resources
          </v-btn>
        </div>
      </div>


        <NewUser v-if="isNewUser" class="mt-15" />

        <ExistingUser v-else class="mt-15" />

        <HelpfulResourcesCards :isNewUser="isNewUser" />

        <div class="bg-white">
          <div class="container-max-width pt-5">
          <a 
              role="button" 
              @click="isNewUser = !isNewUser" 
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

import { scrollToId } from "@/helpers";

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
    scrollToId("HelpfulResourcesCards");
  }

}

</script>
