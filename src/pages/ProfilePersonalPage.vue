<template>
  <div class="q-ma-lg row" v-if="user">
    <q-card class="my-card" flat style="background-color: #fafafa;">
      <img :src="user.profilePictureURL" style="border-radius: 50%;" />
      <q-card-section>
        <div class="text-h6 text-center">{{ user.username }} #{{ user.id }}</div>
      </q-card-section>
    </q-card>
  </div>

</template>

<script>
import { defineComponent } from 'vue';
import Cookies from 'js-cookie';

export default defineComponent({
  name: "ProfilePersonalPage",

  data() {
    return {
      user: null,
    };
  },
  mounted() {
    const storedUser = Cookies.get('user');
    this.user = storedUser ? JSON.parse(storedUser) : null;
  },
});
</script>
