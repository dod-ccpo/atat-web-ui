<template>
  <v-app id="app">
    <v-img
        max-height="150"
        max-width="250"
        src="./assets/logo.png"/>
    <v-alert
        border="top"
        color="red lighten-2"
        dark
    >
      I'm an alert with a top border and red color
    </v-alert>
    <!-- Users:
     <users /> -->
    <hello-world></hello-world>

  </v-app>
</template>

<style lang="scss">
@import "./sass/atat.scss";
</style>

<script>
import HelloWorld from './components/HelloWorld.vue'
//import users from './components/users.vue'


export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 10px;
}
</style>
