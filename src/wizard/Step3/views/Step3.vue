<template>
  <create-application-form
    :application="applicationDetails"
  ></create-application-form>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Application } from "types/Portfolios";
import CreateApplicationForm from "../components/CreateApplicationForm.vue";

@Component({
  components: {
    CreateApplicationForm,
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
}
</script>

<style scoped></style>
