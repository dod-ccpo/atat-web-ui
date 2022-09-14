<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      JWCC offerings for cloud services and support services
    </h2>
    <p> 
      The JWCC acquisition vehicle provides globally available commercial cloud 
      services to the DoD, across all security domains and at all classification levels.     
    </p>
    <p>
      The following categories of cloud resources, tools, and services are available.
    </p>

    <div 
      v-for="(section, index) in requirements"
      :key="index + '-' + section.sectionTitle"
    >
      <hr v-if="index > 0" class="mb-4" />

      <h3 class="mb-3 mt-5">{{ section.sectionTitle }}</h3>

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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class PerfReqLearnMore extends Vue {
  public requirements = [
    {
      sectionTitle: "Anything as a Service (XaaS)",
      items: [
        {
          name: "Compute Resources",
          description: `This category includes processing power, memory, storage, 
            regions, and more for computing instances.`,
        },
        {
          name: "Developer Tools and Services",
          categories: [
            "DevSecOps",
            "Data management",
            "Migration tools",
            "Transformation tools",
            "Cloud development tools",
            "Cloud audit/monitoring tools",
            "Cyber tools",
          ]
        },
        {
          name: "Applications",
          categories: [
            "Application",
            "Web app",
            "Database",
            "Monitoring tools",
            "Discrete PaaS",
            "Discrete SaaS",
          ]
        },
        {
          name: "Advanced Technology and Algorithmic techniques (machine learning)",
          categories: [
            "Specialized tools",
            "Specialized applications",
            "Specialized PaaS",
            "Specialized SaaS",
          ]
        },
        {
          name: "Networking",
          categories: [
            "CSP networks",
            "Hybrid networks",
            "Custom networks",
          ]
        },
        {
          name: "Security",
          categories: [
            "Security services",
            "CSP cloud security",
            "Zero Trust/Permissive Trust security",
            "Custom security",
          ]
        },
        {
          name: "Database with Storage",
          categories: [
            "Database services",
            "Horizontal",
            "Vertical",
            "Graph database",
          ]
        },
        {
          name: "Edge Computing and Tactical Edge",
          categories: [
            "Remotable technology",
            "Mobile technology",
            "Perimeter technology",
            "Conditional flag indicating military hardening",
          ]
        },
        {
          name: "Internet of Things (IoT)",
          categories: [
            "IoT Edge",
            "IoT SaaS",
            "IoT PaaS",
          ]
        },
        {
          name: "General IaaS, PaaS and SaaS",
          description: `This category encompasses any other Infrastructure as a Service, 
            Platform as a Service, and Software as a Service requirements not covered 
            by the other categories, to include third party marketplace.`,
        },        
      ]
    },
    {
      sectionTitle: "Cloud Support Package",
      items: [
        {
          name: "Advisory and assistance",
          description: `This category customizes advisory support packages based on 
            the level of complexity for your challenge.`,
        },
        {
          name: "Training",
          description: `This category customizes support packages for location and 
            web-based training requirements.`,
        },
      ]
    },
  ];

}
</script>
