<template>
  <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
  </div>

  <div class="q-ma-lg flex justify-center" v-if="user && !loading">
    <q-card
      flat
      style="background-color: #fafafa; max-width: 300px"
    >
      <img
        :src="user.profilePictureURL"
        alt="Profilkép"
        style="border-radius: 50%"
      />
      <q-card-section class="">
        <div class="text-h6 text-center">
          {{ user.username }} #{{ user.id }}
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div v-if="!loading">
    <div class="q-mt-md q-ma-lg" v-if="eventsCreatedByUser.length > 0">
      <q-table
        :rows="eventsCreatedByUser"
        :columns="columns"
        row-key="id"
        @row-click="openCardCreator"
        :rows-per-page-options="[5]"
        title="Szervező vagyok"
        style="min-width: 250px;"
      />
    </div>
    <div class="q-mt-md q-ma-lg" v-else>
      <q-table
        title="Szervező vagyok"
        no-data-label="Jelenleg nem szervez egyetlen eseményt sem"
      />
    </div>

    <div class="q-mt-md q-ma-lg"  v-if="eventsJoinedByUser.length > 0">
      <q-table
        :rows="eventsJoinedByUser"
        :columns="columns"
        row-key="id"
        @row-click="openCardParticipant"
        :rows-per-page-options="[5]"
        title="Résztvevő vagyok"
        no-data-label="Jelenleg nem vesz részt egyetlen eseményen sem"
      />
    </div>
    <div class="q-mt-md q-ma-lg" v-else>
      <q-table
        title="Résztvevő vagyok"
        no-data-label="Jelenleg nem vesz részt egyetlen eseményen sem"
      />
    </div>
  </div>

  <q-dialog v-model="cardVisible">
    <q-card class="q-ma-md" style="min-width: 200px; max-width: 400px; width: 100%;">
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
          @click="showDeleteConfirmation"
        />
        <q-btn
          v-else
          class="q-col q-ma-md"
          label="Esemény elhagyása"
          color="red"
          @click="showLeaveConfirmation"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="deleteConfirmationVisible">
    <q-card>
      <q-card-section class="text-h6">
        Biztosan törölni szeretné az eseményt?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Nem" color="grey" @click="cancelDelete" />
        <q-space />
        <q-btn label="Igen" color="red" @click="deleteEvent" />
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="leavingConfirmationVisible">
    <q-card>
      <q-card-section class="text-h6">
        Biztosan el szeretné hagyni az eseményt?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Nem" color="grey" @click="cancelLeave" />
        <q-space />
        <q-btn label="Igen" color="red" @click="leaveEvent" />
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
      loading: true,
      deleteConfirmationVisible: false,
      leavingConfirmationVisible: false,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    this.fetchEventData();
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
      this.showDeleteConfirmation = false;
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
      this.showLeaveConfirmation = false;
    },
    async participantLeft() {
      await axios.patch(`api/events/${this.selectedRow.id}`, {
        participants: this.selectedRow.participants - 1,
      });
    },
    async fetchEventData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        await Promise.all([
          this.getEventsCreatedByUser(),
          this.getEventsJoinedByUser(),
        ]);

        this.loading = false;
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    },
    showDeleteConfirmation() {
      this.deleteConfirmationVisible = true;
      this.cardVisible = false;
    },
    showLeaveConfirmation() {
      this.leavingConfirmationVisible = true;
      this.cardVisible = false;
    },
    cancelDelete() {
      this.deleteConfirmationVisible = false;
      this.cardVisible = true;
    },
    cancelLeave() {
      this.leavingConfirmationVisible = false;
      this.cardVisible = true;
    }
  },
});
</script>

<style>
.loading-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-spinner {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #8bc34a;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
