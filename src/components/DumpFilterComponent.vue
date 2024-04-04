<template>
  <div class="q-ma-lg" :class="{ 'q-ma-lg': $q.screen.width > 1024 }">
    <div
      :style="{
        width: $q.screen.width > 1024 ? '1000px' : '270px',
        margin: 'auto',
      }"
    >
      <div class="q-gutter-md flex justify-center">
        <q-input
          v-model="searchName"
          filled
          clearable
          type="search"
          label="Név"
          class="q-mb-md"
        />
        <q-input
          v-model="searchCity"
          clearable
          label="Város"
          filled
          class="q-mb-md"
        />

        <div style="margin-top: 20px">
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
        <div style="margin-top: 20px">
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

  <div v-if="filteredData.length > 0" class="q-ma-lg" style="margin-top: 80px">
    <q-table
    :style="{
        width: $q.screen.width > 1024 ? '1700px' : '270px',
        margin: 'auto',
      }"
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
          <h2 class="text-h6 q-mb-md text-center">{{ selectedRow.name }}</h2>
          <p class="text-body2 q-mb-md">{{ selectedRow.description }}</p>
          <div class="q-mb-md">
            <strong>Cím:</strong> {{ selectedRow.location }}
          </div>
          <div class="q-mb-md">
            <strong>Telefonszám:</strong> {{ selectedRow.contactPhone }}
          </div>
          <div class="q-mb-md">
            <strong>Email:</strong> {{ selectedRow.contactEmail }}
          </div>
          <div class="q-mb-md">
            <strong>Azonosító:</strong> {{ selectedRow.id }}
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="q-gutter-sm flex justify-center">
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
import Cookies from "js-cookie";

export default {
  data() {
    return {
      searchName: "",
      searchCity: "",
      filteredData: [],
      columns: [
        {
          name: "name",
          label: "Név",
          align: "left",
          field: "name",
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
          name: "contactPhone",
          label: "Telefonszám",
          align: "left",
          field: "contactPhone",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
        {
          name: "contactEmail",
          label: "Email",
          align: "left",
          field: "contactEmail",
          sortable: true,
          headerStyle: "font-weight: bold; font-size: 16px;",
        },
      ],
      cardVisible: false,
      selectedRow: null,
      userId: "",
      creatorName: null,
      dumpName: null,
      user: null,
      searchButtonDisabled: false,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;

    this.searchData();
  },
  computed: {
    checkInputFields() {
      return !this.searchName && !this.searchCity;
    },
  },
  methods: {
    async searchData() {
      try {
        const response = await axios.get("/api/dumps", {
          params: {
            name: this.searchName,
            location: this.searchCity,
          },
        });
        this.filteredData = response.data.filter((item) => {
          const lowerSearch = this.searchName.toLowerCase();
          const lowerCity = this.searchCity.toLowerCase();

          return (
            item.name.toLowerCase().includes(lowerSearch) == true &&
            item.location.toLowerCase().includes(lowerCity) == true
          );
        });
      } catch (error) {
        console.error("Hiba a keresés során:", error);
      }
    },
    async filterReset() {
      this.searchName = "";
      this.searchCity = "";
      this.filteredData = [];
      this.searchData();
    },
    async openCard(event, row, columnIndex) {
      this.selectedRow = row;
      await Promise.all([this.getDumpName()]);
      this.cardVisible = true;
    },
    closeCard() {
      this.selectedRow = null;
      this.cardVisible = false;
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
  },
};
</script>
