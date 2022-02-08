<template>
  <v-footer absolute class="atat-page-footer">
    <div class="links">
      <a href="#">Security Notice</a>
      <a href="#">Privacy</a>
      <a href="#">Accessibility</a>
    </div>
    <div>
      Last login: Sept. 3, 2020 1616-0400
    </div>
  </v-footer>
</template>

<script>
export default {
  name: "ATATFooter",
}
</script>

<style lang="scss" scoped>
.theme--light.v-footer.atat-page-footer {
  background-color: transparent;
  margin: 0 56px;
  padding: 20px 0 40px;
  border-top: 1px solid #DFE1E2;
  height: 84px;
  width: calc(100% - 112px);
  justify-content: space-between;
  font-size: 1.4rem;
}
.links {
  a {
    margin-right: 1.6rem;
  }
} 
</style>