<template>
    <div class="d-flex align-start flex-column">
    <h2 class='mb-5'>
        2. Compliance with Military Service-specific policies
    </h2>
    <p class='d-flex align-start flex-column'>
        You may need authorization from your Military Service prior to placing 
         a task order under the JWCC Contract. Customers are responsible for complying 
         with Military Service-specific cloud acquisition requirements. Prior to 
         proceeding with the development of your JWCC requirements package, each customer 
         must confirm their understanding of this responsibility.
    </p>
      <ATATCheckboxGroup
        id="projectDisclaimer"
        :card='false'
        label='disclaimer.label'
        :groupLabelId="groupLabelId"
        :value.sync="_selectedDisclaimer"
        :items="disclaimer"
        name="project-disclaimer-checkbox-group"
        :rules="_rules"
        :class="[{ '_big-bold-label' : boldText }]"
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
  private _selectedDisclaimer!: string | null;
    @Prop({default: "project-disclaimer"}) private groupLabelId!: string;
    @Prop({default: true}) private isForm!: boolean;
    @Prop({default: ""}) private groupLabel!: string;
    
    @PropSync("rules") private _rules!: "";

    @Prop({ default: true }) private boldText!: boolean;
    
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
  