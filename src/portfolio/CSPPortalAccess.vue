
<template>
  <div>
    <div>
      <CSPCard
        :cloudServiceProvider="portfolioCSP"
      />
    </div>
    <div>
      <div class="d-flex justify-space-between mt-11 mb-6">
        <h2>CSP administrator log</h2>
        <v-btn
          depressed
          color="primary"
        >
          <ATATSVGIcon
            class="mr-2"
            width="17"
            height="14"
            name="manageAccount"
            color="white"
          />
          Add a CSP Administrator
        </v-btn>
      </div>

      <div>
        <v-data-table
          :headers="tableHeaders"
          :items="tableData"
          :page.sync="page"
          hide-default-footer
          class="_administrator-log border1 border-base-lighter"
        >
          <!-- eslint-disable vue/valid-v-slot -->
          <template v-slot:item.status="{ item }">
            <div class="d-flex align-center">
              <div
                class="_icon-circle"
                :class="statusImg[item.status].bgColor"
              >
                <ATATSVGIcon
                  :name="statusImg[item.status].name"
                  :width="statusImg[item.status].width"
                  :height="statusImg[item.status].height"
                  :color="statusImg[item.status].color"
                />
              </div>
              <div class="d-flex flex-column font-weight-500">
                {{item.status}}
                <span
                  v-if="item.status === 'Failed'"
                  class="font-size-12 text-base"
                >
                  CSP account already exist
                </span>
              </div>
            </div>
          </template>
          <!-- eslint-disable vue/valid-v-slot -->
          <template v-slot:footer>
            <div class="_table-pagination">
              <span class="mr-11 font-weight-400 font-size-14">
              showing 1-{{maxPerPage}} of {{tableData.length}}
            </span>
              <v-pagination
                v-model="page"
                :length="2"
                circle
              ></v-pagination>
            </div>
          </template>

        </v-data-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";

import { Component, Prop } from "vue-property-decorator";
import CSPCard from "@/portfolio/components/CSPCard.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";
import format from "date-fns/format"
@Component({
  components: {
    ATATSVGIcon,
    CSPCard,
  }
})
export default class CSPPortalAccess extends Vue {
  @Prop({ default: "" }) private portfolioCSP!: string;

  public page = 1;
  public today = new Date();

  public tableHeaders: Record<string, string>[] = [
    { text: "Administrator email", value: "email" },
    { text: "Status", value: "status" },
    { text: "Added by", value: "createdBy" },
    { text: "Processed on", value: "created" },
  ];

  public tableData: {
    email:string,status:string,createdBy:string,created:string
  }[] = [
    {
      email:"willie.jennings@example.mil",
      status:"Processing",
      createdBy: "Maria Missionowner",
      created: format(this.today,"MMM. dd, yyy hhmm")
    },
    {
      email:"deanna.curtis@example.mil",
      status:"Provisioned",
      createdBy: "Maria Missionowner",
      created: format(this.today,"MMM. dd, yyy hhmm")
    },
    {
      email:"kenzi.lawson@example.mil",
      status:"Failed",
      createdBy: "Maria Missionowner",
      created: format(this.today,"MMM. dd, yyy hhmm")
    },
    {
      email:"curtis.weaver@example.mil",
      status:"Failed",
      createdBy: "Maria Missionowner",
      created: format(this.today,"MMM. dd, yyy hhmm")
    },
    {
      email:"tim.jennings@example.mil",
      status:"Provisioned",
      createdBy: "Maria Missionowner",
      created: format(this.today,"MMM. dd, yyy hhmm")
    },
  ];
  public maxPerPage = 5;

  public statusImg = {
    "Failed":{
      name: "failed",
      width: "16",
      height: "16",
      color: "error",
      bgColor:"bg-error-lighter"
    },
    "Provisioned":{
      name: "provisioned",
      width: "20",
      height: "13",
      color: "success-dark",
      bgColor:"bg-success-lighter"
    },
    "Processing":{
      name: "processing",
      width: "20",
      height: "13",
      color: "info-dark",
      bgColor:"bg-info-lighter"
    }
  };

  public loadOnEnter(): void {
    console.log(this.tableData.length)
  };

  public async mounted(): Promise<void> {
    await this.loadOnEnter();
  };
};
</script>

