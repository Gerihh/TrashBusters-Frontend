<template>
  <div class="absolute-center">
    <q-card square bordered class="q-pa-md shadow-1" style="width: 500px; height: 300px;">
              <q-form class="q-gutter-md" @submit="login">
                <q-input square filled clearable v-model="email" type="email" label="Email" />
                <q-input square filled clearable v-model="password" type="password" label="Jelszó" />
                <q-card-section>
                  <q-btn type="submit" unelevated color="light-green-7" size="lg" class="full-width" label="Bejelentkezés" />
                </q-card-section>
              </q-form>
            <q-card-section class="text-center q-pa-none">
              <p class="text-grey-8">Még nem regisztáltál? <router-link to="/register">Tedd meg itt!</router-link></p>
            </q-card-section>
          </q-card>
  </div>
</template>

<script>
import axios from 'axios';
import useAuth from 'src/composables/useAuth';

export default {
name: 'LoginFormComponent',
data () {
  return {
    email: '',
    username: '',
    password: ''
  };
},
methods: {
  async login() {
    try {
      const response = await axios.post('/api/auth/login', {
        email: this.email,
        password: this.password,
      });

      //Token és User elmentése
      //localStorage.setItem('token', response.data.accessToken);
      //localStorage.setItem('user', JSON.stringify(response.data.user));
      document.cookie = `token=${response.data.accessToken}; path=/;`;
      const userJson = JSON.stringify(response.data.user);
      document.cookie = `user=${userJson}; path=/;`;

      useAuth.isLoggedIn.value = true;

      this.$router.push('/');
      console.log('Sikeres bejelentkezés');

    } catch (error) {
      console.error('Hibás bejelentkezés:', error);
      window.alert('Hibás adatok!');
      this.email = '';
      this.password = '';
    }
  }
}
}
</script>

<style>
.q-card {
width: 360px;
}
</style>