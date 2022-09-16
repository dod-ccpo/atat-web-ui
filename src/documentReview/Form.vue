<template>
  <div id="FormDiv">
    <PageHead 
      :docTitle="docTitle"></PageHead>
    <div>
      <v-form id="reviewForm">
        <h2>Part I. Requirements Owner Information</h2>
        <EmergencyDeclarationSupport
          legend="Is this requirement in support of an emergency declaration?"
          topMarginClass="mt-2"
          :emergencyDeclaration.sync="emergencyDeclaration"
        ></EmergencyDeclarationSupport>
        <ProjectTitle
          class="mt-9"
          label="Project/Requirements Title"
          :currentTitle.sync = "currentTitle"
        ></ProjectTitle>
        <ProjectScope
          class="mt-10"
          label="What is the scope of your requirement?"
          :projectScope.sync="projectScope"
        ></ProjectScope>
      </v-form>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import PageHead from "./components/DocReviewHead.vue"
import { Component, Prop } from "vue-property-decorator";
import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle
  from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope
  from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";


@Component({
  components: {
    PageHead,
    EmergencyDeclarationSupport,
    ProjectTitle,
    ProjectScope
  },
})
export default class DocumentReviewForm extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  
}
</script>
