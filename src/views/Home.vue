<template>
  <div>
    <hello-world />
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import HelloWorld from "../components/HelloWorld.vue";
import { Component } from "vue-property-decorator";
@Component({})
export default class Home extends Vue {}
</script>