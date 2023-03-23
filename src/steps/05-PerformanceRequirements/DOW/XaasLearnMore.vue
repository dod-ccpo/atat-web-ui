<template>
  <div class="_panel-padding">
    <h2 class="mb-5">
      JWCC offerings for Anything as a Service (XaaS)
    </h2>
    <p class="mb-0">
      XaaS offerings may be selected independently or in addition to replicating/optimizing
      your current functions or requesting an architectural design solution. Selections within
      this performance area will be included in addition to any services or offerings proposed by
      the CSPs.<br><br>The following categories of XaaS cloud resources, tools, and services are
      available:
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
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";

@Component({})

export default class XaasLearnMore extends Vue {
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
  ];

}
</script>
