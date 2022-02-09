<template>
  <v-app>
    <ATATSideStepper />
    <v-main id="app">
      <router-view></router-view>
      <ATATFooter />
    </v-main>
  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script>
import ATATSideStepper from "./components/ATATSideStepper.vue";
import ATATFooter from "./components/ATATFooter.vue";
//import users from './components/users.vue'

export default {
  name: "App",
  components: {
    ATATSideStepper,
    ATATFooter,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.v-main__wrap {
  background-color: #fbfbfb; /* DISA Off-white */
  padding: 40px 56px;
  text-align: left;
}
</style>
