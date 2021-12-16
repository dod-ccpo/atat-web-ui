<template>
  <div>
    <div class="body-lg pl-14 pt-3 bg-white">
      <h3 class="h3 mb-0">{{ portfolio.name }}</h3>
      <v-tabs class="atat-tabbar dense">
        <v-tab class="h5 font-weight-bold body px-0 atat-tabbar-content"
          ><div class="tabname pb-4">Funding Tracker</div></v-tab
        >
        <v-tab class="h5 font-weight-bold body px-0 atat-tabbar-content"
          ><div class="tabname pb-4">Task Orders</div></v-tab
        >
        <v-tab class="h5 font-weight-bold body px-0 atat-tabbar-content"
          ><div class="tabname pb-4">Applications</div></v-tab
        >
        <v-tab class="h5 font-weight-bold body px-0 atat-tabbar-content"
          ><div class="tabname pb-4">Settings</div></v-tab
        >
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
