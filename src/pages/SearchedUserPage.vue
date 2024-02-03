<template>
   <div class="q-ma-lg row justify-center" v-if="user">
    <q-card class="my-card" flat style="background-color: #fafafa; max-width: 300px;" >
      <img :src="user.profilePictureURL" alt="Profilkép" style="border-radius: 50%" />
      <q-card-section class="">
        <div class="text-h6 text-center">
          {{ user.username }} #{{ user.id }}
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div>
    <div class="q-mt-md q-ma-lg" v-if="eventsCreatedByUser.length > 0">
      <q-table
        :rows="eventsCreatedByUser"
        :columns="columns"
        row-key="id"
        @row-click="openCard"
        :rows-per-page-options="[5]"
        title="Szervező"
      />
    </div>

    <div class="q-mt-md q-ma-lg" v-if="eventsJoinedByUser.length > 0">
      <q-table
        :rows="eventsJoinedByUser"
        :columns="columns"
        row-key="id"
        @row-click="openCard"
        :rows-per-page-options="[5]"
        title="Résztvevő"
      />
    </div>
  </div>

  <q-dialog v-model="cardVisible">
    <q-card style="min-width: 500px; min-height: 100px">
      <q-card-section>
        <div v-if="selectedRow">
          <h2 class="text-h6 q-mb-md text-center">{{ selectedRow.title }}</h2>
          <p class="text-body2 q-mb-md">{{ selectedRow.description }}</p>
          <div class="q-mb-md">
            <strong>Helyszín:</strong> {{ selectedRow.location }},
            {{ selectedRow.place }}
          </div>
          <div class="q-mb-md">
            <strong>Résztvevők:</strong> {{ selectedRow.participants }} fő
          </div>
          <div class="q-mb-md">
            <strong>Időpont:</strong> {{ selectedRow.date }},
            {{ selectedRow.time }}
          </div>
          <div class="q-mb-md">
            <strong>Szervező:</strong> {{ creatorName }}
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm">
        <q-btn
          class="q-col q-ma-md"
          label="Bezárás"
          color="red"
          @click="closeCard"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
    name: "SearchedUserPage",

    data() {
      return {
        user: null,
        userId: null,
        username: null,
        profilePictureURL: null,
        eventsCreatedByUser: [],
      eventsJoinedByUser: [],
      columns: [
        {
          name: "title",
          label: "Esemény neve",
          align: "left",
          field: "title",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
        {
          name: "location",
          label: "Város",
          align: "left",
          field: "location",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
        {
          name: "participants",
          label: "Résztvevők száma",
          align: "left",
          field: "participants",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
        {
          name: "date",
          label: "Dátum",
          align: "left",
          field: "date",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
      ],
      cardVisible: false,
      selectedRow: null,
      creatorName: null,
      };
    },
    mounted() {
      this.userId = this.$route.params.id;

      this.getUserById();

      this.getEventsCreatedByUser();
      this.getEventsJoinedByUser();
    },
    methods: {
      async getUserById() {
        try {
          const response = await axios.get(`/api/users/${this.userId}`);
          this.user = response.data;
        } catch (error) {
          console.error("Error fetching user by id:", error);
        }
      },
      async getEventsCreatedByUser() {
      try {
        const response = await axios.get(`/api/events/creator/${this.userId}`);
        this.eventsCreatedByUser = response.data;
      } catch (error) {
        console.error("Error fetching events created by user:", error);
      }
    },
    async getEventsJoinedByUser() {
      try {
        const response = await axios.get(`/api/participants/events/joined/${this.userId}`
        );
        this.eventsJoinedByUser = response.data;
      } catch (error) {
        console.error("Error fetching events joined by user:", error);
      }
    },
    async openCard(event, row, columnIndex) {
      this.selectedRow = row;
      this.cardVisible = true;
      await this.getCreatorName();
    },
    closeCard() {
      this.selectedRow = null;
      this.cardVisible = false;
    },
    async getCreatorName() {
      try {
        if (!this.selectedRow || !this.selectedRow.creatorId) {
          this.creatorName = null;
          return;
        }
        const response = await axios.get(
          `/api/users/${this.selectedRow.creatorId}`
        );

        const user = response.data;

        this.creatorName = user.username;
      } catch (error) {
        console.error("Error fetching creator name:", error);
      }
    },
    }
});
</script>