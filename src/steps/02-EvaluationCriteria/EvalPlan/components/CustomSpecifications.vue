
<template>
  <section id="CustomSpecifications" class="copy-max-width">
    <hr>
    <div class="mb-4 ml-10">
      <span class="font-weight-500">Custom {{ specificationType }}s</span>
      <span v-if="isOptional" class="font-size-14 text-base ml-2">Optional</span>
    </div>
    
    <div 
      v-for="(item, index) in _customSpecifications"
      :key="index"
      class="d-flex mb-5" 
    >  
      <div class="px-4 mt-2 text-base font-weight-500 font-size-14">
        {{ index + 1 }}
      </div>

      <ATATTextField 
        :id="'CustomSpec' + index" 
        class="width-100"
        :value="_customSpecifications[index]"
        @update:value="onCustomSpecsChange($event, index)"
        :rules="!isOptional
          ? [$validators.required('Please enter a custom ' + specificationType + '.')]
          : []"
      />

      <v-btn
        icon
        class="ml-2"
        :disabled="_customSpecifications.length === 1 && _customSpecifications[0] === ''
        "
        @click="deleteCustomSpec(index)"
        :aria-label="'Delete this ' + specificationType"
        :id="'DeleteCustomSpec_' + index"
      >
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </div>

    <v-btn
      id="AddCustomSpecButton"
      variant="plain"
      class=" mt-5 link-button no-border"
      :ripple="false"
      @click="addCustomSpec()"
    >
      <ATATSVGIcon 
        name="control-point"
        width="18"
        height="17"
        color="primary"
        class="mr-1"
      />
      <span>Add another {{ specificationType }}</span>
    </v-btn>
  </section>
</template>

<script lang="ts">
 
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import { PropSync } from "@/decorators/custom";
import ATATTextField from "@/components/ATATTextField.vue";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue"

@Component({
  components: {
    ATATTextField,
    ATATSVGIcon,
  }
})

class CustomSpecifications extends Vue {
  @PropSync("customSpecifications") public _customSpecifications!: string[];
  @Prop() public sourceSelection!: string;
  @Prop({ default: false }) public isDifferentiator?: boolean;
  @Prop({ default: false }) public isOptional?: boolean;

  public get isStandards(): boolean {
    return this.sourceSelection.indexOf("TECH_PROPOSAL") > -1;
  }

  public get specificationType(): string {
    if (this.isDifferentiator) {
      return "differentiator";
    }
    return this.isStandards ? "compliance standard" : "assessment area";
  }

  public onCustomSpecsChange(newVal: string, index: number): void {
    this._customSpecifications[index] = newVal
  }

  public addCustomSpec(): void {
    this._customSpecifications.push("");
  }

  public deleteCustomSpec(index: number): void {
    if (this._customSpecifications.length === 1) {
      this._customSpecifications[0] = ''; 
    } else {
      this._customSpecifications.splice(index, 1);
      this._customSpecifications = [...this._customSpecifications];  
    }
  }

}

export default toNative(CustomSpecifications)
</script>
