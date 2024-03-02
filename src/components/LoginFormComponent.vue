<template>
  <div class="absolute-center">
    <q-card
      square
      bordered
      v-if="!forgotPassword"
      class="q-pa-md shadow-1"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '270px' }"
    >
      <q-form class="q-gutter-md" @submit="login">
        <q-input
          square
          filled
          clearable
          v-model="email"
          type="email"
          label="Email"
        />
        <q-input
          square
          filled
          clearable
          v-model="password"
          type="password"
          label="Jelszó"
        />
        <q-card-section>
          <q-btn
            type="submit"
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Bejelentkezés"
          />
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pa-none">
        <p class="text-grey-8">
          Még nem regisztáltál?
          <router-link to="/register">Tedd meg itt!</router-link>
        </p>
      </q-card-section>
      <q-card-section class="text-center q-pa-none">
        <p
          class="text-purple-10"
          style="text-decoration: underline; cursor: pointer"
          @click="forgotPassword = true"
        >
          Elfelejtett jelszó
        </p>
      </q-card-section>
    </q-card>
    <q-card
      square
      bordered
      v-else
      class="q-pa-md shadow-1"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '270px' }"
    >
      <q-form class="q-gutter-md" @submit="sendPasswordResetEmail">
        <q-input
          square
          filled
          clearable
          v-model="email"
          type="email"
          label="Email"
        />
        <q-card-section>
          <q-btn
            type="submit"
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Email küldése"
          />
        </q-card-section>
        <q-card-section class="text-center q-pa-none" style="margin: 0px;">
        <p
          class="text-purple-10"
          style="text-decoration: underline; cursor: pointer; margin: 0px;"
          @click="forgotPassword = false"
        >
          Mégsem
        </p>
      </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import useAuth from "src/composables/useAuth";

export default {
  name: "LoginFormComponent",
  data() {
    return {
      email: "",
      username: "",
      password: "",
      forgotPassword: false,
    };
  },
  methods: {
    async login() {
      try {
        const response = await axios.post("/api/auth/login", {
          email: this.email,
          password: this.password,
        });

        if (response.data.user.isVerified) {
          document.cookie = `token=${response.data.accessToken}; path=/;`;
          const userJson = JSON.stringify(response.data.user);
          document.cookie = `user=${userJson}; path=/;`;

          useAuth.isLoggedIn.value = true;

          this.$router.push("/");
          console.log("Sikeres bejelentkezés");
        }
      } catch (error) {
        try {
          if (!error.response.data.user.isVerified) {
            window.alert("Még nem erősítette meg a felhasználóját!");
          }
        } catch (error) {
          console.log(error);
          window.alert("Hibás email cím vagy jelszó!");

          this.email = "";
          this.password = "";
        }
      }
    },
    async sendPasswordResetEmail() {
      try {
        const response = await axios.post("/api/reset-password", {
          email: this.email,
        });

        if (response.status === 200) {
          this.email = "";
          alert("Email küldve!");
        } else {
          alert("Hiba történt!");
        }
      } catch(error) {
        alert(error.response.data.error);
        this.email = "";
      }
    }
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
