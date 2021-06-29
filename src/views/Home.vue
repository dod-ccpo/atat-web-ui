<template>
<div>
    <!-- <HelloWorld /> -->
        <v-row>
          <v-col
            cols="12"
            sm="6"
            md="3"
          >
          <ATATTextField />
          </v-col>
           <v-col
            cols="12"
            sm="6"
            md="3"
          >
          <ATATSelect />
          </v-col>
           <v-col
            cols="12"
            sm="6"
            md="3"
          >
           </v-col>
        </v-row>
   </div>      
</template>

<script lang="ts">
  import Vue from 'vue'
  import Vuetify from 'vuetify'
  import HelloWorld from '../components/HelloWorld.vue'
  import ATATTextField from '../components/ATATTextField.vue'
  import ATATSelect from '../components/ATATSelect.vue'

export default Vue.extend({
    name: 'Home',

    components: {
      // HelloWorld,
      ATATTextField,
      ATATSelect
    },
  })
</script>
