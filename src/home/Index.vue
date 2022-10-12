<template>
  <div>
    <div class="_hero-banner">
    </div>

    <v-main class="_home">
      Future landing page home - Index.vue

      <NewUser v-if="isNewUser" />

      <ExistingUser v-else />

      <a 
        role="button" 
        @click="isNewUser = !isNewUser" 
        class="mt-10 font-size-12 d-block mt-10"
      >
        Toggle new/existing for testing
      </a>

    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

import ExistingUser from "./ExistingUser.vue";
import NewUser from "./NewUser.vue";

@Component({
  components: {
    ExistingUser,
    NewUser,
  }
})

export default class Home extends Vue {
  public isNewUser = true;

}

</script>
