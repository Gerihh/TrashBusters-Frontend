<template>
  <div class="loading-container" v-if="loading">
    <div class="loading-spinner"></div>
  </div>

  <div class="absolute-center" v-if="userId && !loading">
    <q-card
      square
      bordered
      class="q-pa-md shadow-1"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '270px' }"
    >
      <q-form class="q-gutter-md" @submit="resetPassword">
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
            label="Jelszó visszaállítása"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </div>
  <div v-if="!loading && !userId" class="q-ma-lg text-h6 text-center">
    Helytelen kérés.
  </div>
</template>

<script>
import axios from "axios";
import router from "src/router";

import { defineComponent } from "vue";

export default defineComponent({
  name: "PasswordRecoveryPage",

  data() {
    return {
      userToken: this.$route.params.token,
      userId: null,
      newPassword: "",
      newPasswordAgain: "",
      loading: true,
    };
  },
  mounted() {
    this.getUserByToken();
  },
  methods: {
    async getUserByToken() {
      try {
        const response = await axios.get(
          `/api/user/password-reset-token/${this.userToken}`
        );

        this.userId = response.data.id;
        this.loading = false;
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    async resetPassword() {
      try {
        if (this.newPassword === this.newPasswordAgain) {
          const response = await axios.patch(`/api/users/${this.userId}`, {
            password: this.newPassword,
            passwordResetToken: null,
          });
          alert("A jelszó sikeresen helyreállítva!");
          this.$router.push("/login");
        } else {
          alert("A jelszavak nem egyeznek meg!");
          this.newPassword = "";
          this.newPasswordAgain = "";
        }
      } catch (error) {
        alert(error.response.data.error.password);
      }
    },
  },
});
</script>

<style>
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
