<template>
  <div class="ml-10">
    <v-card
      class="border1 border-base-lighter pa-6 _shadow _border-rounded-more"
    >
      <h3 class="mb-3 nowrap">Your completed package includes:</h3>
      <ul class="_atat-ul">
        <li
          v-for="(item, idx) in documentList"
          :key="idx"
          class="text-base py-1"
        >
          {{ item }}
        </li>
      </ul>
      <v-btn
        class="_secondary _text-decoration-none px-6 mt-6"
        size="large"
        role="button"
        @click="downloadDocuments"
      >
        <ATATSVGIcon
          class="mr-2"
          width="14"
          height="19"
          name="download"
          color="primary"
        />
        Download your completed package
      </v-btn>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, toNative } from "vue-facing-decorator";
import AcquisitionPackage from "@/store/acquisitionPackage";
import ATATSVGIcon from "@/components/icons/ATATSVGIcon.vue";

@Component({
  components: {
    ATATSVGIcon,
  },
})
class CompletePackageCard extends Vue {
  private documentList: string[] = [];
  private downloadUnsignedPackagesLink = "";
  private downloadSignedPackagesLink = "";

  public async downloadDocuments(): Promise<void> {
    const urls = [
      this.downloadUnsignedPackagesLink,
      this.downloadSignedPackagesLink,
    ];
    for (let i = 0; i < urls.length; i++) {
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = urls[i];
        a.target = "_blank";
        a.download = urls[i] ? "unsigned" : "signed";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, 1000);
    }
  }

  public async loadOnEnter(): Promise<void> {
    this.documentList = await AcquisitionPackage.getCompletedPackageList();
    this.downloadUnsignedPackagesLink =
      await AcquisitionPackage.setDownloadPackageLink(false);
    this.downloadSignedPackagesLink =
      await AcquisitionPackage.setDownloadPackageLink(true);
  }

  async mounted(): Promise<void> {
    await this.loadOnEnter();
  }
}

export default toNative(CompletePackageCard)
</script>

