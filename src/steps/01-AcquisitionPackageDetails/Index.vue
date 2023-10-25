<template>
  <router-view/>
</template>
<script lang="ts">
 
import { Component , toNative, Vue} from "vue-facing-decorator";

@Component({
})
class AcquisitionPackageDetails extends Vue {
}
export default toNative(AcquisitionPackageDetails)
</script>
