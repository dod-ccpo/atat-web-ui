<template>
  <p>Total</p>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {},
})
export default class IncFundingPlanTotal extends Mixins(SaveOnLeave) {

}
</script>
