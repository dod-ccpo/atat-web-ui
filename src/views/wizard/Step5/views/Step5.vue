<template>
  <portfolio-summary />
</template>

<script lang="ts">
import { WizardNavigation, WizardStepNames } from "../../../../../types/Wizard";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import PortfolioSummary from "../components/PortfolioSummary.vue";
import { mapState } from "vuex";

@Component({
  components: {
    PortfolioSummary,
  },
  computed: {
    ...mapState({
      wizardNavigation: "wizardNavigation",
    }),
  },
})
export default class Step_5 extends Vue {
  mounted(): void {
    this.$store.dispatch(
      "updateWizardStep",
      WizardStepNames.reviewandsubmitStep()
    );
  }

  // this store change will only be triggered by the wizard buttons next/previous
  @Watch("wizardNavigation")
  async onNextStepChanged(navigation: WizardNavigation): Promise<void> {
    debugger;
    this.$router.push({ name: navigation.step });
  }
}
</script>

<style scoped></style>
