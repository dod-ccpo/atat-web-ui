<template>
  <nav class="stepper-nav">
    <hr class="bg-base-lighter" />
    <div class="d-flex pt-6">
      <v-btn
        @click="$emit('previous')"
        role="link"
        class="link-button no-border"
      >
        <v-icon size="16">chevron_left</v-icon>
        Back</v-btn
      >
      <v-btn @click="$emit('next')" color="primary" role="link" class="ml-auto"
        >Continue</v-btn
      >
    </div>
  </nav>
</template>

<script>
export default {
  name: "ATATStepperNavigation",
};
</script>
