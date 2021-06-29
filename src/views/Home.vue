<template>
  <div id="hello-world-view">
    <HelloWorld />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";

export default Vue.extend({
  name: "Home",

  components: {
    HelloWorld,
  },
});
</script>
