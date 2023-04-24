
<template>
  <div class="container-max-width">
    <h1 class="page-header">
      Based on what you told us, you do not need an evaluation plan for this acquisition.
    </h1>
    <ATATAlert
      id="Callout"
      type="callout"
      calloutBackground="primary-lighter"
      class="max-width-840 mb-10"
    >
      <template v-slot:content>
        <h2 class="mb-2">
          Why don’t I need an evaluation plan?
        </h2>
        <p id="IntroP" class="mb-4">
          An evaluation plan is used to establish the basis for how your
          acquisition will be evaluated during the source selection process.
        </p>
        <p id="SecondP">
          Since your requirement qualifies for an exception to the fair
          opportunity process, your evaluation team will assess the CSP’s entire
          solicitation response for technical acceptability. A task order award
          will be issued on a sole-source basis to the CSP that you specified in
          the previous section.
        </p>
      </template>
    </ATATAlert>
  </div>
</template>

<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import {Component, Mixins} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";

@Component({
  components: {
    ATATAlert
  }
})

export default class NoEvalPlan extends Mixins(LoadOnEnter) {}

</script>
