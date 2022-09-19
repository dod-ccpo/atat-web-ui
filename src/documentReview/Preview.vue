<template>
  <div>
    <div class="no-text-decoration d-flex align-center">
      <v-btn 
        class="plain bg-transparent mx-7 my-4 pa-0" 
        @click="$emit('showView', 'form')" >
          <ATATSVGIcon class="mr-2" name="arrowBack" width="16" height="16" />
      
      <h3>Document Preview: {{ docTitle }}</h3>
      </v-btn>
    </div>
    <hr class="ma-0 bg-base-lighter" />
    <div id="PreviewForm">
      <h1>{{ docTitle }}</h1>
      <ol>
        <li>
          <EmergencyDeclarationSupport
            :isForm="false"
            :emergencyDeclaration="docData.acqPackage.emergency_declaration"
            legend="Emergency: This requirement is in support of an Emergency Declaration."
          />
        </li>
        <li>
          <strong id="ReqInfo" class="mb-4 d-block">Requirements Information</strong>
          <div aria-describedby="ReqInfo">
            <ProjectTitle
              class="mb-2"
              :isForm="false"
              :currentTitle="docData.acqPackage.title"
            />
            <ProjectScope
              :isForm="false" 
              :projectScope="docData.acqPackage.scope"
            />
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

import EmergencyDeclarationSupport 
  from "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue";
import ProjectTitle from "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue";
import ProjectScope from "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue";

import { Component, Prop } from "vue-property-decorator";

@Component({
  components: {
    ATATSVGIcon,
    EmergencyDeclarationSupport,
    ProjectTitle,
    ProjectScope,
  },
})
export default class DocumentReviewPreview extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  @Prop() private docData!:  Record<string, Record<string, unknown>>;
}
</script>
