
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
          Since an exception to the fair opportunity process applies to your requirement,
          the evaluation team will assess your Cloud Service Provider’s entire solicitation
          response for technical acceptability. If the proposal meets the Government’s needs,
          then a task order award will be issued on a sole-source basis.
        </p>
        <p>
          To edit your evaluation criteria,
          <router-link
              id="ExceptionsLink"
              :to="{ name: routeNames.Exceptions }">
            revisit the Exception to Fair Opportunity section.
          </router-link>
        </p>
      </template>
    </ATATAlert>
  </div>
</template>

<script lang="ts">
import LoadOnEnter from "@/mixins/loadOnEnter";
import {Component, Mixins} from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import {routeNames} from "@/router/stepper";

@Component({
  components: {
    ATATAlert
  }
})

export default class NoEvalPlan extends Mixins(LoadOnEnter) {
  public routeNames = routeNames;
}

</script>
