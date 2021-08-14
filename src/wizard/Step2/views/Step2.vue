<template>
  <v-flex>
    <CreateTaskOrderForm
    ref="createTaskOrderForm"
    :task_order_number.sync="taskOrderDetails.task_order_number"
  />
    <atat-file-upload
      :multiple="false"
      :pdfFile.sync="taskOrderDetails.task_order_file"
      @addUploadedFiles="processUpload($event)"
      label="Upload your approved Task Order"
      message="Only PDF files with a max file size of 20 MB"
      :maxFileSize="20"
    />
  </v-flex>
  
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";
import CreateTaskOrderForm from "@/wizard/Step2/components/CreateTaskOrderForm.vue";
import { TaskOrderDetails } from "types/Wizard";

@Component({
  components: {
    CreateTaskOrderForm,
  },
})
export default class Step_2 extends Vue {
  $refs!: {
    createTaskOrderForm: CreateTaskOrderForm;
  };

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

  // @Watch("taskOrderDetails.task_order_file")
  // protected uploadFile(newVal: TaskOrderFile, oldVal: TaskOrderFile): void {
  //   this.$http.post("taskOrderFiles", newVal).then(function (res) {
  //     console.log(res);
  //   });
  // }
}
</script>

  public async validate(): Promise<boolean> {
    let valid = false;
    valid = await this.$refs.createTaskOrderForm.validateForm();

    return valid;
  }
}
</script>
