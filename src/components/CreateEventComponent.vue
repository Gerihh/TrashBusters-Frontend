<template>
    <div class="q-ma-lg flex justify-center">
      <q-btn
        v-if="!showForm"
        label="Új esemény létrehozása"
        color="green"
        class="q-mb-md q-pa-md"
        @click="showForm = !showForm"
      />
    </div>
    <div class="flex justify-center" v-if="showForm">
      <q-card
        square
        bordered
        class="q-ma-md q-pa-sm shadow-1"
      >
        <q-form @submit.prevent="createEvent">
          <q-input
            square
            filled
            clearable
            v-model="title"
            type="title"
            label="Cím"
            required
            class="q-ma-sm"
          />
          <q-input
            square
            filled
            clearable
            v-model="description"
            type="description"
            label="Leírás"
            class="q-ma-sm"
          />
          <q-input
            square
            filled
            clearable
            v-model="location"
            type="location"
            label="Város"
            required
            class="q-ma-sm"
          />
          <q-input
            square
            filled
            clearable
            v-model="place"
            type="place"
            label="Utca, tér"
            required
            class="q-ma-sm"
          />
          <q-input
            square
            filled
            clearable
            v-model="date"
            type="date"
            label="Dátum"
            :min="minDate"
            required
            class="q-ma-sm"
          />
          <q-input
            square
            filled
            clearable
            v-model="time"
            type="time"
            label="Időpont"
            required
            class="q-ma-sm"
          />
          <q-card-section>
            <q-btn
              type="submit"
              unelevated
              color="green-7"
              size="lg"
              class="full-width q-mt-sm"
              label="Esemény létrehozása"
            />
          </q-card-section>
        </q-form>
      </q-card>
    </div>
</template>

<script>
import axios from "axios";
import Cookies from "js-cookie";

export default {
  name: "CreateEventComponent",
  data() {
    return {
      showForm: false,
      title: "",
      description: "",
      location: "",
      place: "",
      date: "",
      time: "",
      participants: "",
      creatorId: "",
      minDate: "",
    };
  },
  mounted() {
    const today = new Date().toISOString().split("T")[0];
    this.minDate = today;
  },
  methods: {
    async createEvent() {
      try {
        const user = JSON.parse(Cookies.get("user"));
        if (!user) {
          alert("Nem vagy bejelentkezve!");
          return;
        }

        this.creatorId = user.id;

        const requestData = {
          title: this.title,
          description: this.description,
          location: typeof this.location === "string" ? this.location : "",
          place: typeof this.place === "string" ? this.place : "",
          date: this.date,
          time: this.time,
          participants: this.participants + 1,
          creatorId: this.creatorId,
        };

        await axios.post("/api/events", requestData);
        alert("Sikeresen létrehozta az eseményt!");

        this.title = "";
        this.description = "";
        this.location = "";
        this.place = "";
        this.date = "";
        this.time = "";

        this.showForm = false;
      } catch (error) {
        console.error("Error creating event:", error);
        alert("Hiba a felvétel során!");
      }
    },
  },
};
</script>
