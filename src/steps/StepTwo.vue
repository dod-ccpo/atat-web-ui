<template>
  <div>
    <div>Step Two</div>
    <v-container>
      <v-row>
        <v-col
            cols="12"
            md="4"
        >
          <p>{{ checked }}</p>
          <v-checkbox v-for="item in items" :key="item"
              v-model="checked"
              :label= item
              :value=item
          ></v-checkbox>
          <v-combobox
              v-model="select"
              :items="items"
              label="Combobox"
              multiple
              outlined
              dense
          ></v-combobox>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name:"StepOne",
  data: () => ({
    checked:null,
    select:null,
    items: [
      'Programming',
      'Design',
      'Vue',
      'Vuetify',
    ],
  })
}
</script>
