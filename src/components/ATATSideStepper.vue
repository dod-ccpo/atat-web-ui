<template>
  <v-navigation-drawer
    app
    permanent
    class="global-side-nav-bar"
    width="350"
  >
    <v-list>
      <v-list-item>
        <a href="#">Step 1</a>
      </v-list-item>
      <v-list-item>
        <a href="#">Step 2</a>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  name: "ATATSideStepper"
}
</script>

<style lang="scss" scoped>
.theme--light.v-navigation-drawer.global-side-nav-bar {
  background-color: #E0E1E2;  /* DISA base-lighter */
  padding: 24px !important;
}
.v-list {
  padding: 0;
  .v-list-item {
    padding: 0;
    a {
      font-size: 1.7rem;
    }
  }
}
</style>
