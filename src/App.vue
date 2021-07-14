<template>
  <v-app>
    <div>
      <ATATHeader />
      <v-spacer></v-spacer>
    </div>
    <!-- <v-navigation-drawer>
    </v-navigation-drawer> -->
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
    <atat-footer />
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ATATHeader from "./components/ATATHeader.vue";

@Component({
  components: {
    ATATHeader,
  },
})
export default class App extends Vue {}
</script>
