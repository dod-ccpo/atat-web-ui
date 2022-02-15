<template>
  <div class="d-flex flex-column">
    <div class="mx-auto" v-if="users.length == 0">LOADING...</div>
     <v-card v-else
     v-for="user in users" :key="user.sysId" class="pa-2 mb-6" outlined tile>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline font-weight-bold mb-4 text-h2">
            <strong>{{ user.first_name }} {{ user.last_name }}</strong>
          </div>
          <v-list-item-title class="text-h5 mb-1">
            {{ user.email }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { UserData } from "../models/User";
import api from "../api";

@Component({})
export default class Users extends Vue {
  users: UserData[] = [];

  async mounted(): Promise<void> {
    this.users = await api.users.getAllUsers();
  }
}
</script>
