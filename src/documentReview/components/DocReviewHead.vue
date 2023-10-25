<template>
  <div>
    <v-breadcrumbs class="pa-0 mb-3" :items="breadCrumbItems">
      <template v-slot:divider>
        <ATATSVGIcon 
          name="chevronRight" 
          width="7" 
          height="12" />
      </template>
    </v-breadcrumbs>
    <h1>{{ docTitle }}</h1>
  </div>
</template>

<script lang="ts">
import { BreadCrumbItem } from "types/Global";
import { Component, Prop, Vue, toNative } from "vue-facing-decorator";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components:{
    ATATSVGIcon
  }
})
class DocReviewHead extends Vue {
  @Prop({ default: "" }) private docTitle!: string;
  public breadCrumbItems: BreadCrumbItem[] = [
    {
      text: "Acquisitions",
      disabled: false,
      href: "#",
    },
    {
      text: "Demo Package",
      disabled: false,
      href: "#",
    },
    {
      text: "Requirements Checklist",
      disabled: true,
      href: "#",
    },
  ];
}
export default toNative(DocReviewHead);
</script>
