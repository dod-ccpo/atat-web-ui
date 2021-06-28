<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
    <v-footer>
      <v-container>
        <v-row>
          <v-col> footer: counter: {{ countNumber(4) }} | blue </v-col>
          <v-col class="text-right">
            Last login: Jun 24 2021 13:25 -04:00
          </v-col>
        </v-row>
      </v-container>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => {
    // testing for format
  },
  methods: {
    countNumber(number: string | number) {
      // TESTING FOR FORMAT
      for (let i = 1; number > i; i++) {
        console.log("count: " + i);
      }
      // TESTING IF FORMAT
      if (number) {
        return "counted to " + number + " done";
      } else {
        return "Nor number counted";
      }
    },
  },
});
</script>
