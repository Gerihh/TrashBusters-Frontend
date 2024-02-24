<template>
  <div class="q-ma-lg flex justify-center">
    <q-btn
      @click="showDeleteConfirmation"
      label="Profil törlése"
      color="red"
      class="q-ma-lg"
    />
  </div>

  <div class="q-ma-lg flex justify-center">
    <input type="file" @change="handleFileChange" />
    <button @click="uploadProfilePicture">Upload Profile Picture</button>
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
      profilePicture: null,
    };
  },
  mounted() {
    const storedUser = Cookies.get("user");
    this.user = storedUser ? JSON.parse(storedUser) : null;
  },
  methods: {
    handleFileChange(event) {
      this.profilePicture = event.target.files[0];
    },
    uploadProfilePicture() {
      const formData = new FormData();
      formData.append('profilePicture', this.profilePicture);

      // Assuming you have Axios installed and available globally
      axios.post('/api/upload', formData)
        .then(response => {
          console.log('File uploaded successfully:', response.data.path);
          // You can handle the response as needed (e.g., update UI)
        })
        .catch(error => {
          console.error('Error uploading file:', error);

        });
    },
    showDeleteConfirmation() {
      this.deleteConfirmationVisible = true;
    },
    cancelDelete() {
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
