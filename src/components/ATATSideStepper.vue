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
