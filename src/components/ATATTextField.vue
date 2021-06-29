<template>
  <div>
    <v-flex>
      <div class="text-form-field-label my-1">
        Text Field label
      </div>
    </v-flex>
    <v-flex>
      <v-text-field
          outlined
          dense
          :height = "42"
          :rounded = rounded>
        </v-text-field>
    </v-flex>
  </div>
</template>

<script lang="ts">
import { VTextField } from 'vuetify/lib'
import { Component,  Prop } from 'vue-property-decorator'

@Component({})
export default class ATATTextField extends VTextField {
    //props
    @Prop({default: 'auto'}) private hideDetails!: boolean|string;
    @Prop({default: true}) private dense!: boolean
    @Prop({default: true}) private singleLine!: boolean;
    @Prop({default: 'secondary'}) private color!: string

    //data
    private rounded = false; 
}
</script>
