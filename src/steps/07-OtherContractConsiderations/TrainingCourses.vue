<template>
  <div class="mb-7">
    <v-form ref="form" lazy-validation>
      <v-container fluid class="container-max-width">
        <v-row>
          <v-col class="col-12">
            <h1 class="page-header mb-3">
              Tell us about your mandatory training
            </h1>
            <div class="copy-max-width">
              <p class="mb-10">
                In the field(s) below, specify the training courses that contractors will 
                be required to complete, based on your requirements and organization policies.
                Add or remove as many courses as needed.
              </p>
            </div>

            <div class="mb-4 _semibold" style="padding-left: 25px">
              Required training courses
            </div>
            <div id="TrainingCourseList" class="d-flex flex-column">
              <div
                v-for="(trainingCert, index) in trainingCerts"
                :key="'TrainingCourse' + index"
                class="d-inline-block py-2 _training-course"
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
    </v-form>
  </div>
</template>

<script lang="ts">
/* eslint-disable camelcase */
import { Component, Mixins } from "vue-property-decorator";
import ATATTextField from "@/components/ATATTextField.vue";
import { stringObj } from "../../../types/Global";
import { ContractConsiderationsDTO } from "@/api/models";
import AcquisitionPackage, { StoreProperties } from "@/store/acquisitionPackage";
import { hasChanges } from "@/helpers";
import SaveOnLeave from "@/mixins/saveOnLeave";


@Component({
  components: {
    ATATTextField,
  },
})
export default class TrainingCourses extends Mixins(SaveOnLeave) {
  private savedData: ContractConsiderationsDTO = {};
  public trainingCerts: stringObj[] = [
    {name: ""}
  ];

  private transformTrainingCerts(certs: stringObj[]): string {
    const trainingObj: stringObj = {}
    certs.forEach((cert, index) => {
      trainingObj[index] = cert.name
    })
    return JSON.stringify(trainingObj)
  }

  private parseTrainingCerts(certs: string): stringObj[] {
    const arr = []
    const parsedCerts = JSON.parse(certs)
    for (const cert in parsedCerts) {
      arr.push({'name': parsedCerts[cert]})
    }
    return arr
  }

  public addTrainingCert(): void {
    const newTrainingCert = {};
    this.trainingCerts.push(newTrainingCert);
  }

  public deleteTrainingCert(index: number): void {
    this.trainingCerts.splice(index, 1);

  }

  public get currentData(): ContractConsiderationsDTO {
    return {
      required_training_courses: this.transformTrainingCerts(this.trainingCerts) || "",
    };
  }

  public async loadOnEnter(): Promise<void> {
    const storeData = await AcquisitionPackage.loadData<ContractConsiderationsDTO>({
      storeProperty: StoreProperties.ContractConsiderations
    });

    this.savedData = {
      required_training_courses: storeData.required_training_courses || '',
    }
    if (storeData && storeData.required_training_courses) {
      this.trainingCerts = this.parseTrainingCerts(storeData.required_training_courses) || ""
    }
  }

  public isChanged(): boolean {
    return hasChanges(this.savedData, this.currentData);
  }

  protected async saveOnLeave(): Promise<boolean> {
    try {
      if (this.isChanged()) {
        await AcquisitionPackage.saveData({
          data: this.currentData,
          storeProperty: StoreProperties.ContractConsiderations,
        });

      }
    } catch (error) {
      console.log(error);
    }

    return true;
  }

  public async mounted(): Promise<void> {
    await this.loadOnEnter();

  }
}
</script>
