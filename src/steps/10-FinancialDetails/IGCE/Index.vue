<template>
  <div>
    <router-view />
  </div>
</template>

<script lang="ts">
import IGCEStore from "@/store/IGCE";

import { Component, Vue, toNative } from "vue-facing-decorator";
@Component({
})
class IGCE extends Vue {
  public mounted(): void{
    IGCEStore.setHasDOWandPop();
  }
}
export default IGCE
</script>


