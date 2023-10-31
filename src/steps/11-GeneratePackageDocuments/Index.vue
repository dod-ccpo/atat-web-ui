
<template>
  <router-view/>
</template>
<script lang="ts">

import { Component, Vue, toNative } from "vue-facing-decorator";
@Component({
})
class GeneratePackageDocuments extends Vue {
}

export default toNative(GeneratePackageDocuments)
</script>

