<template>
  <div class="q-ma-lg">
    <q-btn label="Új esemény létrehozása" color="green" style="padding: 10px; width: 250px; margin-left: 550px;" @click="showForm = !showForm"/>
  </div>

  <div class="absolute-center" v-if="showForm">
      <q-card square bordered class="q-pa-md shadow-1" style="width: 500px; height: 400px;">
                <q-form class="q-gutter-md" @submit.prevent="createEvent">
                  <q-input square filled clearable v-model="title" type="title" label="Cím" required/>
                  <q-input square filled clearable v-model="description" type="description" label="Leírás"/>
                  <q-input square filled clearable v-model="location" type="location" label="Város" required/>
                  <q-input square filled clearable v-model="date" type="date" label="Dátum" required/>
                  <q-card-section>
                    <q-btn type="submit" unelevated color="green-7" size="lg" class="full-width" label="Esemény létrehozása" />
                  </q-card-section>
                </q-form>
            </q-card>
    </div>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  name: 'CreateEventComponent',
  data() {
    return {
      showForm: false,
      title: '',
      description: '',
      location: '',
      date: '',
      participants: '',
      creatorId: ''
    };
  },
  methods: {
    async createEvent() {
      try {
        const user = JSON.parse(Cookies.get('user'));
        if (!user) {
          alert('Nem vagy bejelentkezve!');
          return;
        }

        this.creatorId = user.id

        const requestData = {
          title: this.title,
          description: this.description,
          location: this.location,
          date: this.date,
          participants: this.participants + 1,
          creatorId: this.creatorId,
        };

        const response = await axios.post('/api/events', requestData);
        console.log('Event created', response.data);
        alert('Sikeresen létrehozta az eseményt!');

        this.title = '';
        this.description = '';
        this.location = '';
        this.date = '';
    } catch (error) {
        console.error('Error creating event:', error);
        alert('Hiba a felvétel során!');
      }
    },
  },
};
</script>