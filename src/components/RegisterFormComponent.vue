<template>
  <div class="absolute-center">
    <q-card
      square
      bordered
      class="q-pa-md shadow-1"
      :class="{ 'q-ma-lg': $q.screen.width > 1024 }"
      :style="{ width: $q.screen.width > 1024 ? '500px' : '250px' }"
    >
      <q-form class="q-gutter-md" @submit="register">
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
          v-model="username"
          type="username"
          label="Felhasználónév"
        />
        <q-input
          square
          filled
          clearable
          v-model="city"
          type="city"
          label="Város"
        />
        <q-input
          square
          filled
          clearable
          v-model="password"
          type="password"
          label="Jelszó"
        />
        <q-input
          square
          filled
          clearable
          v-model="passwordAgain"
          type="password"
          label="Jelszó mégegyszer"
        />
        <q-card-section>
          <q-btn
            type="submit"
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Regisztrálás"
          />
        </q-card-section>
      </q-form>
      <q-card-section class="text-center q-pa-none">
        <p class="text-grey-8">
          Van már felhasználód?
          <router-link to="/login">Jelentkezz be itt!</router-link>
        </p>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import useAuth from "src/composables/useAuth";

export default {
  name: "RegisterFormComponent",
  data() {
    return {
      email: "",
      username: "",
      city: "",
      password: "",
      passwordAgain: "",
    };
  },
  methods: {
    async register() {
      if (this.password == this.passwordAgain) {
        try {
          await axios.post("/api/auth/register", {
            email: this.email,
            username: this.username,
            city: this.city,
            password: this.password,
          });

          useAuth.isLoggedIn.value == true;

          this.$router.push("/login");
          alert("Sikeres regisztráció");
        } catch (error) {
          console.error("Hibás regisztráció:", error);
          this.email = "";
          this.username = "";
          this.city = "";
          this.password = "";
          this.passwordAgain = "";
        }
      } else {
        alert("A jelszavak nem egyeznek!");
        this.password = "";
        this.passwordAgain = "";
      }
    },
  },
};
</script>

<style>
.q-card {
  width: 360px;
}
</style>
