<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      JWCC offerings for cloud services and cloud support
    </h2>
    <p> 
      The JWCC acquisition vehicle provides globally available commercial cloud services 
      to the DoD, across all security domains and at all classification levels.
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
          description: `This category customizes configurations for your compute instances, 
            including processing power, memory, storage, and performance tier.`,
        },
        {
          name: "Developer Tools and Services",
          categories: [
            "DevSecOps",
            "Migration Tools",
            "Transformation Tools",
            "Cloud Development Tools",
            "Cloud Audit/Monitoring Tools",
            "Cyber Tools",
          ]
        },
        {
          name: "Applications",
          categories: [
            "Application",
            "Web app",
            "Database",
            "Monitoring Tools",
            "Platform as a Service (PaaS)",
            "Software as a Service (SaaS)",
          ]
        },
        {
          name: `Advanced Technology and Algorithmic 
            techniques (machine learning) and Data Analytics`,
          categories: [
            "Specialized tools",
            "Specialized applications",
            "Specialized PaaS",
            "Specialized SaaS",
            "Data Management"
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
            "Managed CSP cloud security solution",
            "Cloud-specific security solution",
            "Zero Trust/Permissive Trust security",
            "Custom security",
          ]
        },
        {
          name: "Database",
          description: `This category customizes configurations for your database instances,
            including database type, processing power, memory, storage, and network
            performance.`
        },
        {
          name: "Storage (Other than Compute and Database)",
          description: `This category customizes any other storage requirements that you
            have separate from Compute and Database instances.`
        },
        {
          name: "Edge Computing and Tactical Edge",
          categories: [
            "Mobility",
            "Conditional flag indicating military hardening",
            "Delivery"
          ]
        },
        {
          name: "Internet of Things (IoT)",
          categories: [
            "IoT Edge",
            "IoT Software as a Service (SaaS)",
            "IoT Platform as a Service (PaaS)",
          ]
        },
        {
          name: "General IaaS, PaaS and SaaS",
          description: `This category encompasses any other Infrastructure as a Service
            (IaaS), Platform as a Service (PaaS), and Software as a Service (SaaS) 
            requirements not covered by the other categories, to include third party 
            marketplace.`,
        },        
      ]
    },
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

}
</script>
