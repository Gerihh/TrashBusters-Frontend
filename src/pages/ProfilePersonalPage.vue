<template>
  <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
  </div>

  <div class="q-ma-lg flex justify-center" v-if="user && !loading">
    <q-card flat style="background-color: #fafafa">
      <img :src="`${user.profilePictureURL}?${Date.now()}`" alt="Profilkép"
        style="border-radius: 50%; max-height: 300px; max-width: 300px" />
      <q-card-section class="">
        <div class="text-h6 text-center">
          {{ user.username }} #{{ user.id }}
        </div>
      </q-card-section>
    </q-card>
  </div>

  <div v-if="!loading">
    <div class="q-mt-md q-ma-lg" v-if="eventsCreatedByUser.length > 0">
      <q-table :rows="eventsCreatedByUser" :columns="columns" row-key="id" @row-click="openCardCreator"
        :rows-per-page-options="[5]" title="Szervező vagyok" style="min-width: 250px" />
    </div>
    <div class="q-mt-md q-ma-lg" v-else>
      <q-table title="Szervező vagyok" no-data-label="Jelenleg nem szervez egyetlen eseményt sem" />
    </div>

    <div class="q-mt-md q-ma-lg" v-if="eventsJoinedByUser.length > 0">
      <q-table :rows="eventsJoinedByUser" :columns="columns" row-key="id" @row-click="openCardParticipant"
        :rows-per-page-options="[5]" title="Résztvevő vagyok"
        no-data-label="Jelenleg nem vesz részt egyetlen eseményen sem" />
    </div>
    <div class="q-mt-md q-ma-lg" v-else>
      <q-table title="Résztvevő vagyok" no-data-label="Jelenleg nem vesz részt egyetlen eseményen sem" />
    </div>
  </div>

  <q-dialog v-model="cardVisible">
    <div class="q-ma-lg" :class="{ 'q-ma-lg': $q.screen.width > 1024 }">
      <div :style="{
        width: $q.screen.width > 1024 ? '500px' : '300px',
        margin: 'auto',
      }">
        <q-card style="min-width: 200px; max-width: 400px; width: 100%">
          <q-card-section>
            <div v-if="selectedRow">
              <h2 class="text-h6 q-mb-md text-center">
                {{ selectedRow.title }}
              </h2>
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
              <div class="q-mb-md"><strong>Lerakó:</strong> {{ dumpName }}</div>
            </div>
          </q-card-section>

          <q-card-actions v-if="openedFromCreator" class="q-gutter-sm flex justify-center">
            <q-btn class="q-col q-ma-md" label="Esemény törlése" color="red" @click="showDeleteConfirmation" />
            <q-btn v-if="openedFromCreator" class="q-col q-ma-md" label="Esemény szerkesztése" color="orange-5"
              @click="editEvent" />
            <q-btn class="q-col q-ma-md" label="Bezárás" color="red" @click="closeCard" />
          </q-card-actions>
          <q-card-actions v-else class="q-gutter-sm column justify-center">


            <q-btn class="q-col q-ma-sm" label="Esemény elhagyása" color="red" @click="showLeaveConfirmation" />
            <q-space />
            <q-btn class="q-col q-ma-sm" label="Bezárás" color="red" @click="closeCard" />
          </q-card-actions>
        </q-card>
      </div>
    </div>
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

  <q-dialog v-model="editEventVisible">
    <div class="q-mt-md q-ma-lg flex justify-center">
    <q-card
      square
      bordered
      class="q-pa-sm"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '250px' }"
    >
    <q-btn v-if="$q.screen.width > 1024"
        round
        icon="close"
        color="red"
        size="md"
        style="top: -20px; right: -480px; margin: -10px;"
        @click="editEventVisible = false; cardVisible = true"
      />
      <q-btn v-if="$q.screen.width < 1024"
        round
        icon="close"
        color="red"
        size="md"
        style="top: -20px; right: -230px; margin: -10px"
        @click="editEventVisible = false"
      />
        <q-form @submit.prevent="updateEvent">
          <q-input square filled clearable v-model="editedEvent.title" type="title" :key="title" label="Cím" required
            class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.description" type="description" :key="description"
            label="Leírás" class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.location" type="location" label="Város" :key="location"
            required class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.place" type="place" label="Utca, tér" :key="place"
            required class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.date" type="date" label="Dátum" :key="date" :min="minDate"
            required class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.time" type="time" :key="time" label="Időpont" required
            class="q-ma-sm" />
          <q-input square filled clearable v-model="editedEvent.dumpId" type="dumpId" :key="dumpId"
            label="Lerakó azonosítója" class="q-ma-sm" />
          <q-card-section>
            <q-btn type="submit" unelevated color="green-7" size="lg" class="full-width q-mt-sm"
              label="Esemény frissítése" />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
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
      dumpName: null,
      userId: "",
      openedFromCreator: false,
      loading: true,
      deleteConfirmationVisible: false,
      leavingConfirmationVisible: false,
      editEventVisible: false,
      editedEvent: {
        title: "",
        description: "",
        location: "",
        place: "",
        date: "",
        time: "",
        dumpId: "",
      },
      minDate: "",

    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    const today = new Date().toISOString().split("T")[0];
    this.minDate = today;
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
      await this.getDumpName();
    },
    async openCardParticipant(event, row, columnIndex) {
      this.selectedRow = row;
      this.cardVisible = true;
      this.openedFromCreator = false;
      await this.getCreatorName();
      await this.getDumpName();
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
    async getDumpName() {
      try {
        if (!this.selectedRow) {
          return;
        }
        const eventResponse = await axios.get(
          `/api/events/${this.selectedRow.id}`
        );
        if (eventResponse.data.dumpId) {
          const response = await axios.get(
            `/api/dump/name/${eventResponse.data.dumpId}`
          );

          this.dumpName = response.data;
        } else {
          this.dumpName = "-";
        }
      } catch (error) {
        console.error("Error fetching dump name:", error);
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
    async editEvent() {
      // Fetch the edited event when the edit button is clicked
      try {
        const response = await axios.get(`/api/events/${this.selectedRow.id}`);
        this.editedEvent = response.data;
        // Set the form fields with the values from the fetched event
        this.title = this.editedEvent.title;
        this.description = this.editedEvent.description;
        this.location = this.editedEvent.location;
        this.place = this.editedEvent.place;
        this.date = this.editedEvent.date;
        this.time = this.editedEvent.time;
        this.dumpId = this.editedEvent.dumpId;
        // Show the edit form
        this.editEventVisible = true;
        this.cardVisible = false;
      } catch (error) {
        console.error("Error fetching edited event:", error);
      }
    },
    async updateEvent() {
      // Implement the logic to update the event
      try {
        await axios.patch(`/api/events/${this.selectedRow.id}`, {
          title: this.editedEvent.title,
          description: this.editedEvent.description,
          location: this.editedEvent.location,
          place: this.editedEvent.place,
          date: this.editedEvent.date,
          time: this.editedEvent.time,
          dumpId: this.editedEvent.dumpId,
        });
        alert("Esemény sikeresen frissítve!");
        this.closeCard();
        window.location.reload();
      } catch (error) {
        console.error("Error updating event:", error);
      }
      this.editEventVisible = false;
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
    },
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
