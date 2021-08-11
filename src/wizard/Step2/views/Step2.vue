<template>
  <v-flex>
    <atat-file-upload
      :multiple="false"
      :pdfFile.sync="taskOrderDetails.task_order_file"
      @addUploadedFiles="processUpload($event)"
      label="Upload your approved Task Order"
      message="Only PDF files with a max file size of 20 MB"
    />
  </v-flex>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { TaskOrderDetails } from "types/Wizard";

@Component({})
export default class Step_2 extends Vue {
  private processUpload(fileList: FileList) {
    debugger;
    //this.taskOrderDetails.task_order_file = fileList[0]
  }

  private taskOrderDetails: TaskOrderDetails = {
    task_order_number: "",
    task_order_file: {
      description: "",
      id: "",
      created_at: "",
      updated_at: "",
      size: 0,
      name: "",
      status: "",
    },
    clins: [
      {
        clin_number: "",
        idiq_clin: "",
        total_clin_value: 0,
        obligated_funds: 0,
        pop_start_date: "",
        pop_end_date: "",
      },
    ],
  };
}
</script>

<style scoped></style>
