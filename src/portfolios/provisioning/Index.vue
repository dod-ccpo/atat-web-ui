<template>
  <router-view/>
</template>
<script lang="ts">;
import { Vue, toNative, Component } from "vue-facing-decorator";

@Component
class ProvisioningIndex extends Vue {
}
export default toNative(ProvisioningIndex)
</script>
