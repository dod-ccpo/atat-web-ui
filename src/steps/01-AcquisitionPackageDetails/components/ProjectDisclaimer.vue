<template>
    <div class="d-flex align-start flex-column">
    <h2>
        2. Compliance with Military Service-specific policies
    </h2>
      <ATATCheckboxGroup
        id="projectDisclaimer"
        :groupLabel="groupLabel"
        :groupLabelId="groupLabelId"
        :value.sync="_projectDisclaimer"
        :items="disclaimer"
        name="project-disclaimer-checkbox-group"
        :rules="_rules"
        class='font-weight-regular !important'
      />
    </div>
</template>
   
<script lang="ts">
import Vue from "vue";
import { Component, Prop, PropSync} from "vue-property-decorator";
import ATATCheckboxGroup from "@/components/ATATCheckboxGroup.vue";
import { 
  Checkbox,  
} from "types/Global";

  @Component({
    components: {
      ATATCheckboxGroup,
    },
  })
export default class ProjectDisclaimer extends Vue {
    @PropSync("projectDisclaimer", { default: "" })
      private _projectDisclaimer!: string | null;
    @Prop({default: "project-disclaimer"}) private groupLabelId!: string;
    @Prop({default: true}) private isForm!: boolean;
    @Prop({default: ""}) private groupLabel!: string;
    
    @PropSync("rules") private _rules!: "";
    
public disclaimer: Checkbox[] = [ 
  {
    id: "Yes_ProjectDisclaimer",
    label: `I acknowledge that I am in compliance with my Military 
    Service-specific policies related to cloud acquisition, as applicable.`,
    value: "YES"
  }
];
}
</script>
  