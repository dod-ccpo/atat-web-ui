<template>
  <div>Step 4 View</div>
</template>

<script lang="ts">
import { WizardNavigation, WizardStepNames } from "../../../../../types/Wizard";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { mapState } from "vuex";

@Component({
  computed: {
    ...mapState({
      wizardNavigation: "wizardNavigation",
    }),
  },
})
export default class Step_4 extends Vue {
  mounted(): void {
    this.$store.dispatch(
      "updateWizardStep",
      WizardStepNames.addteammembersStep()
    );
  }

  // this store change will only be triggered by the wizard buttons next/previous
  @Watch("wizardNavigation")
  async onNextStepChanged(navigation: WizardNavigation): Promise<void> {
    switch (navigation.action) {
      case "next":
        // todo: add validation
        // if (await this.validate()) {
        //   this.$router.push({ name: navigation.step });
        // }

        this.$router.push({ name: navigation.step });
        break;
      case "previous":
        this.$router.push({ name: navigation.step });
        break;
    }
  }
}
</script>

<style scoped></style>
