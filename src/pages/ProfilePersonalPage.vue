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
        @row-click="openCardCreator"
        :rows-per-page-options="[5]"
        title="Szervező vagyok"
      />
    </div>

    <div class="q-mt-md q-ma-lg" v-if="eventsJoinedByUser.length > 0">
      <q-table
        :rows="eventsJoinedByUser"
        :columns="columns"
        row-key="id"
        @row-click="openCardParticipant"
        :rows-per-page-options="[5]"
        title="Résztvevő vagyok"
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
        <q-space />
        <q-btn
          v-if="openedFromCreator"
          class="q-col q-ma-md"
          label="Esemény törlése"
          color="red"
          @click="deleteEvent"
        />
        <q-btn
          v-else
          class="q-col q-ma-md"
          label="Esemény elhagyása"
          color="red"
          @click="leaveEvent"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent } from "vue";
import Cookies from "js-cookie";
import axios from "axios";

export default defineComponent({
  name: "ProfilePersonalPage",

  data() {
    return {
      user: null,
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
      userId: "",
      openedFromCreator: false,
      selectedFile: null,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    this.getEventsCreatedByUser();
    this.getEventsJoinedByUser();
  },
  methods: {
    async getEventsCreatedByUser() {
      try {
        const response = await axios.get(`/api/events/creator/${this.user.id}`);
        this.eventsCreatedByUser = response.data;
      } catch (error) {
        console.error("Error fetching events created by user:", error);
      }
    },
    async getEventsJoinedByUser() {
      try {
        const response = await axios.get(
          `/api/participants/events/joined/${this.user.id}`
        );
        this.eventsJoinedByUser = response.data;
      } catch (error) {
        console.error("Error fetching events joined by user:", error);
      }
    },
    async openCardCreator(event, row, columnIndex) {
      this.selectedRow = row;
      this.cardVisible = true;
      this.openedFromCreator = true;
      await this.getCreatorName();
    },
    async openCardParticipant(event, row, columnIndex) {
      this.selectedRow = row;
      this.cardVisible = true;
      this.openedFromCreator = false;
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
    async deleteEvent() {
      try {
        await axios.delete(`/api/events/${this.selectedRow.id}`);
        alert("Sikeresen töröltem az eseményt!");
        this.closeCard();
        window.location.reload();
      } catch (error) {
        console.error("Error deleting event:", error);
      }
    },
    async leaveEvent() {
      try {
        await axios.delete(
          `/api/participants/delete/${this.selectedRow.id}/${this.user.id}`
        );
        this.participantLeft();
        alert("Sikeresen elhagyta az eseményt!");
        this.closeCard();
        window.location.reload();
      } catch (error) {
        console.error("Error leaving event:", error);
      }
    },
    async participantLeft() {
      await axios.patch(`api/events/${this.selectedRow.id}`, {
        participants: this.selectedRow.participants - 1,
      });
    },
  },
});
</script>
