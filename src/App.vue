<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <ATATFooter />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import ATATFooter from "./components/ATATFooter.vue";

export default Vue.extend({
  name: "App",
  components: {
    ATATFooter,
  },
  data: () => {
    //
    return {};
  },
});
</script>
