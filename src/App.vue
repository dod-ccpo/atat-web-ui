<template>
  <div id="app">
    <img src="./assets/logo.png" />
   <!-- Users:
    <users /> -->
    <hello-world></hello-world>
  </div>
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
