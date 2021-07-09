<template>
  <v-container class="dashboard-body">
    <v-row>
      <v-col cols="8">
        <div>
          <h1 class="dashboard-header">ATAT Cloud Services</h1>
          <h2>Welcome to the Account Tracking and Automation Tool, Maria!</h2>
          <p class="dashboard-content">
            ATAT is your tool for provisioning new cloud resources across
            multiple vendors and classification levels. Within ATAT, you can
            create Portfolios to consolidate details about your project into a
            single location, including:
          </p>
          <v-row class="pl-5">
            <v-col cols="1">
              <v-img
                :src="require('../assets/dashboard/Step1.svg')"
                contain
                height="30"
                min-width="25"
              />
            </v-col>
            <v-col cols="5">
              <p>Task Orders</p>
            </v-col>
          </v-row>
          <v-row class="pl-5">
            <v-col cols="1">
              <v-img
                :src="require('../assets/dashboard/Step2.svg')"
                contain
                height="30"
                min-width="25"
              />
            </v-col>
            <v-col cols="5">
              <p>Application and Environments</p>
            </v-col>
          </v-row>
          <v-row class="pl-5">
            <v-col cols="1">
              <v-img
                :src="require('../assets/dashboard/Step3.svg')"
                contain
                height="30"
                min-width="25"
              />
            </v-col>
            <v-col cols="5">
              <p>Team Members</p>
            </v-col>
          </v-row>
          <v-spacer></v-spacer>
          <p class="dashboard-content">
            Once your Portfolio is set up, you can submit this information to
            selected cloud service providers, provisioning your workspaces and
            teams, as well as establishing a funding stream between your
            organization and the cloud provider(s).
          </p>
          <v-spacer></v-spacer>
          <p class="dashboard-content">
            Team members that develop your applications will then have access to
            their workspaces within the CSP console, and you will be able to
            track their cloud spend and contract period of performance directly
            within ATAT.
          </p>
          <v-col cols="6">
            <hr />
          </v-col>
          <h2>Getting Started</h2>
          <p class="dashboard-content">
            First, you will need to verify your contact information that was
            imported from your Active Directory user profile. Our administrators
            may use this information to contact you, in the event that there is
            an issue with your cloud resources or funding.
          </p>
          <v-container class="profile-card">
            <v-row>
              <v-col>
                <h3>Maria Missionowner</h3>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <p class="pb-0">maria.missionowner-civ@mail.mil</p>
                <p>(555) 555-55555</p>
              </v-col>
              <v-col>
                <p>Service Branch: Army</p>
                <p>Citizenship: United States</p>
              </v-col>
            </v-row>
            <v-btn depressed color="primary" href="#">
              Update Your Profile
            </v-btn>
          </v-container>
        </div>
      </v-col>
      <v-col cols="4">
        <div class="dashboard-image">
          <v-img
            :src="require('../assets/dashboard/dashboard-image.png')"
            contain
            height="500"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "Dashboard",
};
</script>

<style scoped>
.profile-card {
  background-color: #faf3d1;
  border: 1px solid #e5a000;
}

h1.dashboard-header {
  font-family: Source Sans Pro;
  font-style: normal;
  font-weight: bold;
  font-size: 44px;
  line-height: 51px;
  padding-bottom: 20px;
}
h2 {
  padding-bottom: 15px;
  padding-top: 15px;
}
p.dashboard-content {
  padding-bottom: 15px;
}
.dashboard-image {
  position: relative;
  top: 60px;
}
.dashboard-body {
  max-width: 960px;
}
</style>
