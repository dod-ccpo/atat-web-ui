<template>
    <v-container-fluid>
        <v-row>
            <v-col>
                <h1>Let’s confirm your contact information</h1>
                

            </v-col>
        </v-row>
    </v-container-fluid>
</template>

<script lang="ts">
import ATATAutoComplete from "@/components/ATATAutoComplete.vue";
import ATATRadioGroup from "@/components/ATATRadioGroup.vue";
import ATATSelect from "@/components/ATATSelect.vue";
import ATATTextField from "@/components/ATATTextField.vue";

import Vue from "vue";

import {Component} from "vue-property-decorator";

@Component({
  components: {
    ATATAutoComplete,
    ATATTextField,
    ATATSelect,
    ATATRadioGroup
  },
})

export default class ContactInfo extends Vue {
    
}


</script>