<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import IGCEStore from "@/store/IGCE";
import Vue from "vue";

import { Component } from "vue-property-decorator";
@Component({
})
export default class IGCE extends Vue {
  public mounted(): void{
    IGCEStore.setHasDOWandPop();
  }
}
</script>


