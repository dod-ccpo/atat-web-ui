<template>
  <create-application-form
    :application="applicationDetails"
  ></create-application-form>
</template>

<script lang="ts">
import { WizardNavigation, WizardStepNames } from "../../../../types/Wizard";
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
import { Application } from "types/Portfolios";
import CreateApplicationForm from "../components/CreateApplicationForm.vue";

@Component({
  components: {
    CreateApplicationForm,
  },
  computed: {
    ...mapState({
      wizardNavigation: "wizardNavigation",
    }),
  },
})
export default class Step_3 extends Vue {
  private applicationDetails: Application = {
    id: "",
    name: "",
    description: "",
    environments: [
      {
        id: "0",
        name: "Development",
        funding_source: [],
      },
      {
        id: "1",
        name: "Testing",
        funding_source: [],
      },
      {
        id: "2",
        name: "Staging",
        funding_source: [],
      },
      {
        id: "3",
        name: "Production",
        funding_source: [],
      },
    ],
  };

  mounted(): void {
    this.$store.dispatch(
      "updateWizardStep",
      WizardStepNames.addapplicationStep()
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
