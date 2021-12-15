<template>
  <div>
    <div class="body-lg pl-14 pt-3 bg-white">
      <h1 class="mb-0">{{ portfolio.name }}</h1>
      <v-tabs class="atat-tabbar width-70">
        <v-tab class="font-weight-bold body px-0">Funding Tracker</v-tab>
        <v-tab class="font-weight-bold body px-0">Task Orders</v-tab>
        <v-tab class="font-weight-bold body px-0">Applications</v-tab>
        <v-tab class="font-weight-bold body px-0">Settings</v-tab>
      </v-tabs>
    </div>
    <div class="wizard-content"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {},
})
export default class App extends Vue {
  private portfolio = "";
  mounted(): void {
    this.portfolio = this.$store.getters["wizard/getPortfolio"];
    console.log(this.portfolio);
  }
}
</script>
