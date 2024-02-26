<template>
  <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
  </div>
  <div
    class="card-container q-mt-md flex justify-center"
    v-if="!loading && cards[0].title"
  >
    <q-card
      v-for="(card, index) in cards"
      :key="index"
      class="q-ma-md"
      style="min-width: 400px"
    >
      <q-card-section>
        <div>
          <h1 class="text-h4 q-mb-md text-center">{{ card.category }}</h1>
          <h2 class="text-h6 q-mb-md text-center">{{ card.title }}</h2>
          <p class="text-body2 q-mb-md">{{ card.description }}</p>
          <div class="q-mb-md">
            <strong>Helyszín:</strong> {{ card.location }},
            {{ card.place }}
          </div>
          <div class="q-mb-md">
            <strong>Résztvevők:</strong> {{ card.participants }} fő
          </div>
          <div class="q-mb-md">
            <strong>Időpont:</strong> {{ card.date }},
            {{ card.time }}
          </div>
          <div class="q-mb-md">
            <strong>Szervező:</strong> {{ card.creatorName }}
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
  <div v-else-if="!loading && !cards[0].title">
    <h1>no events</h1>
  </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",

  data() {
    return {
      mostParticipantsEvent: null,
      latestEvent: null,
      closestEvent: null,
      cards: [
        {
          category: "",
          title: "",
          description: "",
          location: "",
          place: "",
          participants: "",
          date: "",
          time: "",
          creatorName: "",
        },
        {
          title: "",
          description: "",
          location: "",
          place: "",
          participants: "",
          date: "",
          time: "",
          creatorName: "",
        },
        {
          category: "",
          title: "",
          description: "",
          location: "",
          place: "",
          participants: "",
          date: "",
          time: "",
          creatorName: "",
        },
      ],
      loading: true,
      user: null,
    };
  },
  mounted() {
    this.fetchEventData();
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;
  },
  methods: {
    async getEventWithMostParticipants() {
      try {
        const response = await axios.get("/api/event/most-participants");
        if (response.data) {
          this.mostParticipantsEvent = response.data;

          this.cards[0].category = "Legnépszerűbb";
          this.cards[0].title = this.mostParticipantsEvent.title || "";
          this.cards[0].description =
            this.mostParticipantsEvent.description || "";
          this.cards[0].location = this.mostParticipantsEvent.location || "";
          this.cards[0].place = this.mostParticipantsEvent.place || "";
          this.cards[0].participants =
            this.mostParticipantsEvent.participants || "";
          this.cards[0].date = this.mostParticipantsEvent.date || "";
          this.cards[0].time = this.mostParticipantsEvent.time || "";

          if (this.mostParticipantsEvent.creatorId) {
            const creatorResponse = await axios.get(
              `/api/users/${this.mostParticipantsEvent.creatorId}`
            );
            this.cards[0].creatorName = creatorResponse.data.username || "";
          } else {
            this.cards[0].creatorName = "";
          }
        }
      } catch (error) {
        console.error("Error fetching most participants event:", error);
      }
    },
    async getLatestEvent() {
      try {
        const response = await axios.get("/api/event/latest");
        if (response.data) {
          this.latestEvent = response.data;

          this.cards[1].category = "Legfrissebb";
          this.cards[1].title = this.latestEvent.title || "";
          this.cards[1].description = this.latestEvent.description || "";
          this.cards[1].location = this.latestEvent.location || "";
          this.cards[1].place = this.latestEvent.place || "";
          this.cards[1].participants = this.latestEvent.participants || "";
          this.cards[1].date = this.latestEvent.date || "";
          this.cards[1].time = this.latestEvent.time || "";

          if (this.latestEvent.creatorId) {
            const creatorResponse = await axios.get(
              `/api/users/${this.latestEvent.creatorId}`
            );
            this.cards[1].creatorName = creatorResponse.data.username || "";
          } else {
            this.cards[1].creatorName = "";
          }
        }
      } catch (error) {
        console.error("Error fetching latest event:", error);
      }
    },
    async getClosestEvent() {
      try {
        const response = await axios.get("/api/event/closest");
        if (response.data) {
          this.closestEvent = response.data;

          this.cards[2].category = "Nemsokára kezdődik";
          this.cards[2].title = this.closestEvent.title || "";
          this.cards[2].description = this.closestEvent.description || "";
          this.cards[2].location = this.closestEvent.location || "";
          this.cards[2].place = this.closestEvent.place || "";
          this.cards[2].participants = this.closestEvent.participants || "";
          this.cards[2].date = this.closestEvent.date || "";
          this.cards[2].time = this.closestEvent.time || "";

          if (this.closestEvent.creatorId) {
            const creatorResponse = await axios.get(
              `/api/users/${this.closestEvent.creatorId}`
            );
            this.cards[2].creatorName = creatorResponse.data.username || "";
          } else {
            this.cards[2].creatorName = "";
          }
        }
      } catch (error) {
        console.error("Error fetching closest event:", error);
      }
    },
    async fetchEventData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));

        await Promise.all([
          this.getEventWithMostParticipants(),
          this.getLatestEvent(),
          this.getClosestEvent(),
        ]);

        this.loading = false;
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    },
  },
});
</script>

<style scoped>
.card-container {
  gap: 100px;
}
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
