<template>
  <div class="card-container">
    <q-card v-for="(card, index) in cards" :key="index" style="min-width: 500px; min-height: 100px">
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

</template>

<script>
import axios from "axios";
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
      ]
    }
  },
  mounted() {
    this.getEventWithMostParticipants();
    this.getLatestEvent();
    this.getClosestEvent();
  },
  methods: {
    async getEventWithMostParticipants() {
      try {
        const response = await axios.get('/api/event/most-participants');
        this.mostParticipantsEvent = response.data;

        this.cards[0].category = "Legnépszerűbb"
        this.cards[0].title = this.mostParticipantsEvent.title;
        this.cards[0].description = this.mostParticipantsEvent.description;
        this.cards[0].location = this.mostParticipantsEvent.location;
        this.cards[0].place = this.mostParticipantsEvent.place;
        this.cards[0].participants = this.mostParticipantsEvent.participants;
        this.cards[0].date = this.mostParticipantsEvent.date;
        this.cards[0].time = this.mostParticipantsEvent.time;
        axios.get(`/api/users/${this.mostParticipantsEvent.creatorId}`).then(response => {
          this.cards[0].creatorName = response.data.username;
        })
      } catch (error) {
        console.error("Error fetching most participants event:", error);
      }
    },
    async getLatestEvent() {
      try {
        const response = await axios.get('/api/event/latest');
        this.latestEvent = response.data

        this.cards[1].category = "Legfrissebb";
        this.cards[1].title = this.latestEvent.title;
        this.cards[1].description = this.latestEvent.description
        this.cards[1].location = this.latestEvent.location;
        this.cards[1].place = this.latestEvent.place;
        this.cards[1].participants = this.latestEvent.participants;
        this.cards[1].date = this.latestEvent.date;
        this.cards[1].time = this.latestEvent.time;
        axios.get(`/api/users/${this.latestEvent.creatorId}`).then(response => {
          this.cards[1].creatorName = response.data.username;
        })
      } catch (error) {
        console.error("Error fetching most participants event:", error);
      }
    },
    async getClosestEvent() {
      try {
        const response = await axios.get('/api/event/closest');
        this.closestEvent = response.data

        this.cards[2].category = "Nemsokára kezdődik";
        this.cards[2].title = this.closestEvent.title;
        this.cards[2].description = this.closestEvent.description
        this.cards[2].location = this.closestEvent.location;
        this.cards[2].place = this.closestEvent.place;
        this.cards[2].participants = this.closestEvent.participants;
        this.cards[2].date = this.closestEvent.date;
        this.cards[2].time = this.closestEvent.time;
        axios.get(`/api/users/${this.closestEvent.creatorId}`).then(response => {
          this.cards[2].creatorName = response.data.username;
        })
      } catch (error) {
        console.error("Error fetching most participants event:", error);
      }
    },
  }
});
</script>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
</style>
