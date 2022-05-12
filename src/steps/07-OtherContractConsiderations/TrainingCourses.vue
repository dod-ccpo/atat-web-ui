<template>
  <div class="mb-7">
    <v-container fluid class="container-max-width">
      <v-row>
        <v-col class="col-12">
          <h1 class="page-header mb-3">
            Tell us about your mandatory training
          </h1>
          <div class="copy-max-width">
            <p class="mb-10">
              In the field(s) below, specify the training courses that contractors will be required
              to complete, based on your requirements and organization policies. Add or remove as
              many courses as needed.
            </p>
          </div>

          <div class="mb-4 _semibold" style="padding-left: 25px">
            Required training courses
          </div>
          <div class="d-flex flex-column ">
              <div
                v-for="(trainingCert, index) in trainingCerts"
                :key="'TrainingCourse' + index"
                class="d-inline-block py-2 "
                :id="'TrainingCourse' + index + 'Row'"
                :data-index="index"
              >
                <div class="d-flex">
                  <div
                    class="d-flex pt-2 justify-end mr-4 font-size-14 _text-base"
                  >
                    <span class="course-number">{{ index + 1 }}</span>
                  </div>
                  <div>
                    <ATATTextField
                      :key="'TrainingCourse ' + index "
                      :id="'TrainingCourse' + index "
                      class="mr-4"
                      width="424"
                      :rules="[
                        $validators.required(
                        'Please enter the name of your training course.'
                        ),
                        $validators
                        .maxLength(300,'Course name cannot exceed 300 characters.')
                      ]"
                      :value.sync="trainingCerts[index].name"
                    />
                  </div>
                  <div
                    :key="'TrainingCourse ' + index + ' Button'"
                    class="d-flex"
                  >
                    <v-btn
                      icon
                      :disabled="trainingCerts.length === 1"
                      @click="deleteTrainingCert(index)"
                      aria-label="Delete this training course"
                      :id="'TrainingCourse' + index + 'Delete'"
                    >
                      <v-icon> delete</v-icon>
                    </v-btn>
                  </div>
                </div>
              </div>
          </div>
          <v-btn
            id="AddTrainingCertButton"
            plain
            text
            class="_text-link mt-5 pl-0"
            :ripple="false"
            @click="addTrainingCert()"
          >
            <v-icon color="primary" class="mr-1">control_point</v-icon>
            <span>Add another training course</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Vue } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import { stringObj } from "../../../types/Global";


@Component({
  components: {
    ATATTextField,
  },
})
export default class TrainingCourses extends Vue {

  public trainingCerts: stringObj[] = [
    {name: ""}
  ];


  public addTrainingCert(): void {
    const newTrainingCert = {};
    this.trainingCerts.push(newTrainingCert);
  }

  public deleteTrainingCert(index: number): void {
    this.trainingCerts.splice(index, 1);

  }
}
</script>
