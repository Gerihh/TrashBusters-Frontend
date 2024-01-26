<template>
  <div class="q-ma-lg">
    <div class="q-gutter-lg row items-start" >
        <q-input v-model="searchTitle" filled clearable type="search" label="Esemény neve" style="width: 300px;"/>
        <q-input v-model="searchCity" clearable label="Város" filled style="width: 250px;"/>
        <q-input v-model.number="model" type="number" filled label="Min. résztvevők" :min="0" style="width: 150px;"/>
        <q-input v-model="date" type="date" filled label="Dátum" :min="minDate"/>
        <q-btn @click="searchData" label="Keresés" color="green" style="margin-top: 30px; padding: 10px; width: 150px;"/>
        <q-btn @click="filterReset" label="Szűrők törlése" color="red" style="margin-top: 30px; padding: 10px; width: 150px;"/>
    </div>
  </div>
  <div v-if="filteredData.length > 0" class="q-ma-lg" style="margin-top: 80px;">
    <q-table
        :rows="filteredData"
        :columns="columns"
        row-key="id"
        class="q-mt-md"
        @row-click="openCard"
      />
  </div>

  <q-dialog v-model="cardVisible">
  <q-card style="min-width: 500px;;min-height: 100px;">
    <q-card-section>
      <div v-if="selectedRow">
        <h2 class="text-h6 q-mb-md text-center">{{ selectedRow.title }}</h2>
        <p class="text-body2 q-mb-md">{{ selectedRow.description }}</p>
        <div class="q-mb-md">
          <strong>Város:</strong> {{ selectedRow.location }}
        </div>
        <div class="q-mb-md">
          <strong>Résztvevők:</strong> {{ selectedRow.participants }} fő
        </div>
        <div class="q-mb-md">
          <strong>Dátum:</strong> {{ selectedRow.date }}
        </div>
        <div class="q-mb-md">
          <strong>Szervező:</strong> {{ creatorName }}
        </div>
      </div>
    </q-card-section>
    <q-card-actions class="q-gutter-sm">
      <q-btn class="q-col q-ma-md" label="Bezárás" color="red" @click="closeCard" />
        <q-space />
      <q-btn class="q-col q-ma-md" label="Csatlakozás" color="green" @click="joinEvent" />
    </q-card-actions>
  </q-card>
</q-dialog>
</template>

<script>
import axios from 'axios';
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      searchTitle: '',
      searchCity: '',
      model: 0,
      date: '',
      filteredData: [],
      columns: [
        { name: 'title', label: 'Esemény neve', align: 'left', field: 'title', sortable: true, headerStyle: 'font-weight: bold; font-size: 16px;' },
        { name: 'location', label: 'Város', align: 'left', field: 'location', sortable: true, headerStyle: 'font-weight: bold; font-size: 16px;' },
        { name: 'participants', label: 'Résztvevők száma', align: 'left', field: 'participants', sortable: true, headerStyle: 'font-weight: bold; font-size: 16px;' },
        { name: 'date', label: 'Dátum', align: 'left', field: 'date', sortable: true, headerStyle: 'font-weight: bold; font-size: 16px;' },
      ],
      cardVisible: false,
      selectedRow: null,
      userId: '',
      creatorName: null,
      minDate: '',
    };
  },
  mounted() {
  const today = new Date().toISOString().split('T')[0];
  this.minDate = today;
  },
  methods: {
    async searchData() {
      try {
        const response = await axios.get('/api/events', {
          params: {
            title: this.searchTitle,
            location: this.searchCity,
            participants: this.model,
            date: this.date,
          },
        });


          this.filteredData = response.data.filter(item => {

            const lowerSearch = this.searchTitle.toLowerCase();
            const lowerCity = this.searchCity.toLowerCase();

            return (
        (item.title.toLowerCase().includes(lowerSearch) == true) &&
        (item.location.toLowerCase().includes(lowerCity) == true) &&
        (item.participants >= parseInt(this.model) == true) &&
        (this.date ? item.date === this.date : true)
      );
          });
      } catch (error) {
        console.error('Hiba a keresés során:', error);
      }
    },
    async filterReset() {
      this.searchTitle = '';
      this.searchCity = '';
      this.model = 0;
      this.date = '';
      this.filteredData = [];
      this.searchData();
    },
    async openCard(event, row, columnIndex) {
      console.log('Event clicked',row);
      this.selectedRow = row;
      this.cardVisible = true;
      await this.getCreatorName();
    },
    closeCard() {
      this.selectedRow = null;
      this.cardVisible = false;
    },
    async participantJoined() {
      const response = await axios.patch(`api/events/${this.selectedRow.id}`, {
        participants : this.selectedRow.participants + 1,
      });
    },
    async joinEvent() {
      try {
        const user = JSON.parse(Cookies.get('user'));
        if (!user) {
          alert('Nem vagy bejelentkezve!');
          return;
        }

        this.userId = user.id

        const response = await axios.post('/api/participants', {
          eventId: this.selectedRow.id,
          userId: this.userId,
        });
        this.participantJoined();
        console.log('Event created', response.data);
        alert('Sikeresen csatlakozott az eseményhez!');
        this.closeCard();
    } catch (error) {
        console.error('Error joining event:', error);
        alert('Hiba a csatlakozás során!');
      }
    },
    async getCreatorName() {
      try {
    if (!this.selectedRow || !this.selectedRow.creatorId) {
      this.creatorName = null;
      return;
    }

    const response = await axios.get(`/api/users/${this.selectedRow.creatorId}`);

    // Assuming the response.data contains the user data
    const user = response.data;

    // Access the username property
    this.creatorName = user.username;
  } catch (error) {
    console.error('Error fetching creator name:', error);
    // Handle the error as needed
  }
},
  },
};
</script>


