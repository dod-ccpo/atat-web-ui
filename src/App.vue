<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center"></div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <AtatFooter />
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import AtatFooter from "./components/AtatFooter.vue";

export default Vue.extend({
  name: "App",
  components: {
    AtatFooter,
  },
  data: () => {
    //
    return {};
  },
});
</script>
