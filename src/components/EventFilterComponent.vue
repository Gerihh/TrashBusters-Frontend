<template>
  <div class="q-ma-lg" :class="{ 'q-ma-lg': $q.screen.width > 1024 }">
    <div
      :style="{
        width: $q.screen.width > 1024 ? '1000px' : '300px',
        margin: 'auto',
      }"
    >
      <div class="q-gutter-md flex justify-center">
        <q-input
          v-model="searchTitle"
          filled
          clearable
          type="search"
          label="Esemény neve"
          class="q-mb-md"
        />
        <q-input
          v-model="searchCity"
          clearable
          label="Város"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model="searchAddress"
          clearable
          label="Utca, tér"
          filled
          class="q-mb-md"
        />
        <q-input
          v-model.number="model"
          type="number"
          filled
          label="Min. résztvevők"
          :min="0"
          class="q-mb-md"
        />
        <q-input
          v-model="date"
          type="date"
          filled
          label="Dátum"
          :min="minDate"
          class="q-mb-md"
        />

        <div class="q-ma-lg q-gutter-md row flex justify-center">
          <div>
            <q-tooltip
              v-if="checkInputFields"
              anchor="bottom left"
              self="bottom middle"
            >
              <span style="font-size: 12px"
                >Használja valamelyik kategóriaszűrőt</span
              >
            </q-tooltip>
            <q-btn
              @click="searchData"
              label="Keresés"
              color="green"
              style="padding: 10px; width: 140px"
              :disabled="checkInputFields"
            />
          </div>
          <div>
            <q-tooltip
              v-if="checkInputFields"
              anchor="bottom right"
              self="bottom middle"
            >
              <span style="font-size: 12px"
                >Használja valamelyik kategóriaszűrőt</span
              >
            </q-tooltip>
            <q-btn
              @click="filterReset"
              label="Szűrők törlése"
              color="red"
              style="padding: 10px; width: 140px"
              :disabled="checkInputFields"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="filteredData.length > 0" class="q-ma-lg" style="margin-top: 80px">
    <q-table
      :rows="filteredData"
      :columns="columns"
      row-key="id"
      class="q-mt-md"
      @row-click="openCard"
      :rows-per-page-options="[12]"
    />
  </div>
  <q-dialog v-model="cardVisible">
    <q-card
      class="q-ma-md justify-center"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '270px' }"
    >
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
          <div class="q-mb-md"><strong>Lerakó:</strong> {{ dumpName }}</div>
        </div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm">
        <div style="margin: 0px">
          <q-btn
            class="q-col q-ma-md"
            label="Bezárás"
            color="red"
            @click="closeCard"
          />
        </div>
        <q-space />
        <div style="margin: 0px">
          <q-tooltip
            v-if="selectedRow.participants == 0"
            anchor="bottom right"
            self="bottom right"
          >
            <span style="font-size: 12px"
              >Az eseménynek nincsenek résztvevői</span
            >
          </q-tooltip>
          <q-btn
            class="q-col q-ma-md"
            label="Résztvevők"
            color="orange-5"
            @click="openParticipantsCard"
            :disabled="selectedRow.participants == 0"
          />
        </div>
        <q-space />
        <div style="margin: 0px">
          <q-tooltip
            v-if="pairExists"
            anchor="bottom right"
            self="bottom right"
          >
            <span style="font-size: 12px">Már csatlakozott az eseményhez</span>
          </q-tooltip>
          <q-btn
            class="q-col q-ma-md"
            label="Csatlakozás"
            color="green"
            @click="joinEvent"
            :disabled="pairExists"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog v-model="participantsCardVsible">
    <q-card
      class="q-ma-md justify-center"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '270px' }"
    >
      <q-card-section>
        <div v-if="participants.length > 0 && !loading">
          <q-card-section>
            <h2 class="text-h6 q-mb-md text-center">{{ selectedRow.title }}</h2>
            <div
              class="q-mb-md"
              style="max-height: 180px; overflow-y: auto; margin: -25px"
            >
              <!-- Set a maximum height for the list and make it scrollable -->
              <ul style="list-style-type: none; padding: 0; margin: 0">
                <li v-for="participant in participants" :key="participant.id">
                  <div
                    class="flex items-start"
                    @click="openUserProfile(participant.id)"
                  >
                    <div class="q-mr-md">
                      <!-- Set the participant's profile picture as the source -->
                      <img
                        :src="participant.profilePictureURL"
                        alt="Participant Avatar"
                        class="avatar"
                        style="width: 30px; height: 30px; border-radius: 50%"
                      />
                      <!-- You can provide a default image if the profile picture is not available -->
                    </div>
                    <div>
                      <p
                        class="clickable text-purple-10"
                        style="text-decoration: underline; cursor: pointer"
                      >
                        {{ participant.username }}
                      </p>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </q-card-section>
        </div>
        <div v-if="participants.length === 0 && !loading">
          <p>No participants for this event.</p>
        </div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm flex justify-center">
        <div>
          <q-btn
            class="q-col q-ma-md"
            label="Bezárás"
            color="red"
            @click="closeParticipantsCard"
          />
        </div>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  data() {
    return {
      searchTitle: "",
      searchCity: "",
      searchAddress: "",
      model: 0,
      date: "",
      filteredData: [],
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
      userId: "",
      creatorName: null,
      dumpName: null,
      minDate: "",
      pairExists: false,
      user: null,
      searchButtonDisabled: false,
      participantsCardVsible: false,
      participants: [],
      loading: true,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    const today = new Date().toISOString().split("T")[0];
    this.minDate = today;
    this.searchData();
  },
  computed: {
    checkInputFields() {
      return (
        !this.searchTitle &&
        !this.searchCity &&
        !this.searchAddress &&
        !this.model &&
        !this.date
      );
    },
  },
  methods: {
    async searchData() {
      try {
        const response = await axios.get("/api/events", {
          params: {
            title: this.searchTitle,
            location: this.searchCity,
            place: this.searchAddress,
            participants: this.model,
            date: this.date,
          },
        });
        this.filteredData = response.data.filter((item) => {
          const lowerSearch = this.searchTitle.toLowerCase();
          const lowerCity = this.searchCity.toLowerCase();
          const lowerPlace = this.searchAddress.toLowerCase();

          return (
            item.title.toLowerCase().includes(lowerSearch) == true &&
            item.location.toLowerCase().includes(lowerCity) == true &&
            item.place.toLowerCase().includes(lowerPlace) == true &&
            item.participants >= parseInt(this.model) == true &&
            (this.date ? item.date.includes(this.date) : true)
          );
        });
      } catch (error) {
        console.error("Hiba a keresés során:", error);
      }
    },
    async filterReset() {
      this.searchTitle = "";
      this.searchCity = "";
      this.searchAddress = "";
      this.model = 0;
      this.date = "";
      this.filteredData = [];
      this.searchData();
    },
    async openCard(event, row, columnIndex) {
      this.selectedRow = row;
      await Promise.all([
        this.getCreatorName(),
        this.checkPairExists(),
        this.getDumpName(),
      ]);
      this.cardVisible = true;
    },
    closeCard() {
      this.selectedRow = null;
      this.cardVisible = false;
    },
    async joinEvent() {
      try {
        const user = JSON.parse(Cookies.get("user"));
        if (!user) {
          alert("Nem vagy bejelentkezve!");
          return;
        }

        this.userId = user.id;
        const response = await axios.get(
          `/api/participants/event/${this.selectedRow.id}`
        );
        const participantCount = response.data.count;
        await axios.post("/api/participants", {
          eventId: this.selectedRow.id,
          userId: this.userId,
        });
        await axios.patch(`/api/events/${this.selectedRow.id}`, {
          participants: participantCount + 1,
        });

        this.participants = response.data.users

        alert("Sikeresen csatlakozott az eseményhez!");
        window.location.reload();
        this.closeCard();
      } catch (error) {
        console.error("Error joining event:", error);
        alert("Hiba a csatlakozás során!");
        this.closeCard();
      }
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
        if (!this.selectedRow || !this.selectedRow.dumpId) {
          this.dumpName = "-";
          return;
        }

        const response = await axios.get(
          `/api/dump/name/${this.selectedRow.dumpId}`
        );

        this.dumpName = response.data;
      } catch (error) {
        console.error("Error fetching dump name:", error);
      }
    },
    async checkPairExists() {
      try {
        const response = await axios.get(
          `/api/participants/check/${this.selectedRow.id}/${this.user.id}`
        );
        this.pairExists = response.data.exists;
      } catch (error) {
        console.error("Error checking if user is already joined:", error);
      }
    },
    async openParticipantsCard() {
      this.participantsCardVsible = true;
      this.cardVisible = false;
      this.getParticipantsByEventId();
      const response = await axios.get(`/api/participants/event/${this.selectedRow.id}`);

      this.participants = response.data.users;
    },
    async getParticipantsByEventId() {
      try {
        const response = await axios.get(
          `/api/participants/event/${this.selectedRow.id}`
        );
        this.participants = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching participants:", error);
      }
    },
    closeParticipantsCard() {
      this.participantsCardVsible = false;
      this.cardVisible = true;
    },
    openUserProfile(userId) {
      this.$router.push(`/user/${userId}`);
    },
  },
};
</script>
