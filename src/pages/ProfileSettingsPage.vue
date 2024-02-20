<template>
  <div class="q-ma-lg">
    <q-btn
      @click="showDeleteConfirmation"
      label="Profil törlése"
      color="red"
      style="padding: 10px; width: 250px; margin-left: 550px"
    />
  </div>

  <q-dialog v-model="deleteConfirmationVisible">
    <q-card>
      <q-card-section class="text-h6">
        Biztosan törölni szeretné a profilját?
      </q-card-section>
      <q-card-actions align="right">
        <q-btn label="Nem" color="grey" @click="cancelDelete" />
        <q-space />
        <q-btn label="Igen" color="red" @click="confirmDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <div v-if="user">
    <h1>{{ user.id }}</h1>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import Cookies from "js-cookie";
import axios from "axios";
import useAuth from "src/composables/useAuth";

export default defineComponent({
  name: "ProfileSettingsPage",

  data() {
    return {
      user: null,
      deleteConfirmationVisible: false,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;
  },
  methods: {
    showDeleteConfirmation() {
      // Open the confirmation dialog
      this.deleteConfirmationVisible = true;
    },
    cancelDelete() {
      // Close the confirmation dialog and perform any necessary actions
      this.deleteConfirmationVisible = false;
    },
    async confirmDelete() {
      try {
        const response = await axios.get(
          `/api/participants/events/joined/${this.user.id}`
        );
        const participantEvents = response.data;

        await Promise.all(
          participantEvents.map(async (participantEvent) => {
            const eventId = participantEvent.id;
            await axios.patch(`/api/events/${eventId}/participant-left`);
          })
        );
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
      await axios.delete(`/api/users/${this.user.id}`);
      alert("Sikeresen törölte a profilját!");
      this.logout();
      this.deleteConfirmationVisible = false;
    },
    deleteProfile() {
      // Show the confirmation dialog when the button is clicked
      this.showDeleteConfirmation();
    },
    logout() {
      useAuth.isLoggedIn.value = false;
      Cookies.remove("token", { path: "/" });
      Cookies.remove("user", { path: "/" });
      this.user = null;
      this.$router.push("/login");
    },
  },
});
</script>
