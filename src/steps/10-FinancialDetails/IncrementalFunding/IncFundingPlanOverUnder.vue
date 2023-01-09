<template>
  <p>Over Under Alert</p>
</template>

<script lang="ts">
import {Component, Mixins} from "vue-property-decorator";
import SaveOnLeave from "@/mixins/saveOnLeave";

@Component({
  components: {},
})

export default class IncFundingPlanOverUnder extends Mixins(SaveOnLeave) {

}
</script>
