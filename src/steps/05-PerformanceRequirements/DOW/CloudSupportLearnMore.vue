<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      JWCC offerings for cloud support packages
    </h2>
    <p class="mb-0">
      The following services can be included within a cloud support package:
    </p>
    <div 
      v-for="(section, index) in requirements"
      :key="index + '-' + section.sectionTitle"
    >
      <hr v-if="index > 0" class="mb-4" />
      <v-expansion-panels accordion flat>
        <v-expansion-panel 
          v-for="(requirement, index) in section.items"
          :key="index + '-' + requirement.name"
        >
          <v-expansion-panel-header>
            {{ requirement.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <p v-if="requirement.description" class="mb-0">
              {{ requirement.description }}
            </p>
            <div v-if="requirement.categories">
              <p class="mb-4">This category includes the following:</p>
              <ul>
                <li 
                  v-for="(category, index) in requirement.categories"
                  :key="index + '-' + category"
                > 
                  {{ category }}
                </li>
              </ul>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <ATATAlert
      id="CloudSupportLearnMoreAlert"
      type="info"
      :showIcon="true"
      class="mt-5"
    >
      <template v-slot:content>
        <p class="font-weight-500 mb-1">
          JWCC is not a support services contract. In order to procure a cloud support package,
          you must define at least one requirement from the following performance areas:
        </p>
        <div class="mb-0">
          <ul>
            <!-- TODO: pass in prop to determine if current environment exists -->
            <li v-if="true">Your Current Functions</li> 
            <li>Architectural Design Solutions</li>
            <li>Anything as a Service (XaaS)</li>
          </ul>
        </div>
      </template>
    </ATATAlert>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import ATATAlert from "@/components/ATATAlert.vue";
import CurrentEnvironment from "@/store/acquisitionPackage/currentEnvironment";

@Component({
  components: {
    ATATAlert,
  }
})

export default class CloudSupportLearnMore extends Vue {
  private currentEnvironmentExists = "";
  public requirements = [
    {
      sectionTitle: "Cloud Support Services",
      items: [
        {
          name: "Portability plan",
          description: `Refer to the JWCC Contract Performance Work Statement (PWS)
            for definition.`
        },
        {
          name: "Advisory and assistance",
          description: `This category allows you to define the type of advisory
            services that you need.`,
        },
        {
          name: "Help desk services",
          description: `This category enables you to define the type of help desk
            services that you need.`,
        },
        {
          name: "Training",
          description: `This category enables you to customize support packages
            for on-site and virtual training requirements.`,
        },
        {
          name: "Documentation support",
          description: `This category enables you to define the type of support that
            you need related to documentation.`,
        },
        {
          name: "General cloud support",
          description: `This category encompasses any other type of cloud support
            requirements not covered by the other categories.`,
        },
      ]
    },
  ];

  public async mounted(): Promise<void> {
    if (CurrentEnvironment.currentEnvironment) {
      this.currentEnvironmentExists
        = CurrentEnvironment.currentEnvironment.current_environment_exists ? "YES" : "NO"
    }
  };
}
</script>
