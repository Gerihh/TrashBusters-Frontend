<template>
  <div class="q-ma-lg flex justify-center">
    <input type="file" @change="handleFileChange" />
  </div>
  <div class="q-ma-lg flex justify-center">
    <button @click="uploadProfilePicture">Upload Profile Picture</button>
  </div>

  <div class="q-ma-lg flex justify-center">
    <q-btn
      @click="showChangePassword"
      label="Jelszó megváltoztatása"
      color="green"
      class="q-ma-lg"
    />
  </div>

  <div class="q-ma-lg flex justify-center">
    <q-btn
      @click="showDeleteConfirmation"
      label="Profil törlése"
      color="red"
      class="q-ma-lg"
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

  <q-dialog v-model="passwordChangeVisible">
    <q-card
      square
      bordered
      class="q-pa-md shadow-1"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '250px' }"
    >
      <q-form class="q-gutter-md" @submit="changePassword">
        <q-input
          square
          filled
          clearable
          v-model="oldpassword"
          type="password"
          label="Régi jelszó"
        />
        <q-input
          square
          filled
          clearable
          v-model="newpassword"
          type="password"
          label="Új jelszó"
        />
        <q-input
          square
          filled
          clearable
          v-model="newpasswordAgain"
          type="password"
          label="Új jelszó mégegyszer"
        />
        <q-card-section>
          <q-btn
            type="submit"
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Jelszó megváltoztatása"
          />
        </q-card-section>
      </q-form>
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
      passwordChangeVisible: false,
      oldpassword: "",
      newpassword: "",
      newpasswordAgain: "",
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
      formData.append("profilePicture", this.profilePicture);

      axios
        .post(`/api/upload/${this.user.id}`, formData)
        .then((response) => {
          this.user.profilePictureURL = response.data.url;

          Cookies.set("user", JSON.stringify(this.user));
          console.log("File uploaded successfully:", response.data.url);
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    },
    showDeleteConfirmation() {
      this.deleteConfirmationVisible = true;
    },
    cancelDelete() {
      this.deleteConfirmationVisible = false;
    },
    showChangePassword() {
      this.passwordChangeVisible = true;
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
    async changePassword() {
  try {
    // Send the old and new passwords to the server
    const response = await axios.post(`/api/change-password/${this.user.id}`, {
      oldpassword: this.oldpassword,
      newpassword: this.newpassword,
    });

    if (response.data.message === "Password changed successfully") {
      alert("Jelszó sikeresen megváltoztatva");
      this.passwordChangeVisible = false;
    } else {
      console.log(response.data.error);
    }
  } catch (error) {
    console.error("Hiba a jelszó megváltoztatásakor:", error);
  }
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
