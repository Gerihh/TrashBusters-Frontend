<template>
  <div class="q-ma-lg flex justify-center">
    <input type="file" @change="handleFileChange" />
  </div>
  <div class="q-ma-lg flex justify-center">
    <button @click="uploadProfilePicture">Profilkép feltöltése</button>
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
    <q-card style="min-width: 300px" >
      <q-card-section class="flex justify-center">
        <q-input
          v-model="formattedDeletionCode"
          label="Írja be a megerősítő kódot!"
          clearable
          maxlength="6"
          class="flex justify-center"
        />
      </q-card-section>
      <q-card-actions class="flex justify-center">
        <q-btn label="Megerősítés" color="red" @click="verifyDeletionCode" />
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
          v-model="oldPassword"
          type="password"
          label="Régi jelszó"
        />
        <q-input
          square
          filled
          clearable
          v-model="newPassword"
          type="password"
          label="Új jelszó"
        />
        <q-input
          square
          filled
          clearable
          v-model="newPasswordAgain"
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
      oldPassword: "",
      newPassword: "",
      newPasswordAgain: "",
      deletionCode: "",
    };
  },
  computed: {
  formattedDeletionCode: {
    get() {
      return this.deletionCode ? this.deletionCode.toUpperCase() : '';
    },
    set(value) {
      this.deletionCode = value;
    },
  },
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
        .post(`/api/upload-profile-picture/${this.user.id}`, formData)
        .then((response) => {
          this.user.profilePictureURL = response.data.url;

          Cookies.set("user", JSON.stringify(this.user));
          alert("Profilkép sikeresen frissítve");
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
        });
    },
    async showDeleteConfirmation() {
      try {
        const response = await axios.get(
          `/api/profile-deletion-email/${this.user.id}`
        );

        if (response.status === 200) {
          this.deleteConfirmationVisible = true;
          alert("Megerősítő email elküldve!");
        } else {
          console.error(
            "Error sending deletion email. Status code:",
            response.status
          );
        }
      } catch (error) {
        console.error("Error sending deletion email:", error);
      }
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
        const response = await axios.post(
          `/api/change-password/${this.user.id}`,
          {
            oldPassword: this.oldPassword,
            newPassword: this.newPassword,
            newPasswordAgain: this.newPasswordAgain,
          }
        );

        alert(response.data.message);
        this.oldPassword = "";
        this.newPassword = "";
        this.newPasswordAgain = "";
        this.passwordChangeVisible = false;
      } catch (error) {
        alert(error.response.data.error);
        this.oldPassword = "";
        this.newPassword = "";
        this.newPasswordAgain = "";
      }
    },
    async verifyDeletionCode() {
      try {
        const response = await axios.post("/api/verify-deletion-code", {
          userId: this.user.id,
          enteredCode: this.deletionCode,
        });

        if (response.status === 200) {
          await this.confirmDelete();
        } else {
          alert("Hibás kód");
        }
      } catch (error) {
        alert("Hibás kód");
      } finally {
        this.deleteConfirmationVisible = false;
        this.deletionCode = "";
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
