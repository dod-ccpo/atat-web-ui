
<template>
  <div>
    <EmergencyDeclarationSupport
      :isForm="false"
      legend="1.  Emergency: This requirement is in support of an Emergency Declaration.">
    </EmergencyDeclarationSupport>
    <ProjectTitle :isForm="false"></ProjectTitle>
    <ProjectScope :isForm="false"></ProjectScope>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component } from "vue-property-decorator";

import EmergencyDeclarationSupport from 
  "@/steps/01-AcquisitionPackageDetails/components/EmergencyDeclarationSupport.vue"
import ProjectTitle from
  "@/steps/01-AcquisitionPackageDetails/components/ProjectTitle.vue"
import ProjectScope from 
  "@/steps/01-AcquisitionPackageDetails/components/ProjectScope.vue"

@Component({
  components: {
    EmergencyDeclarationSupport,
    ProjectTitle,
    ProjectScope
  }
})
export default class ReviewRequiredFormsStepOne extends Vue {

}
</script>

