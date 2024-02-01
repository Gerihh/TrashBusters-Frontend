<template>
   <div class="q-ma-lg row justify-center" v-if="user">
    <q-card class="my-card" flat style="background-color: #fafafa; max-width: 300px;" >
      <img :src="user.profilePictureURL" alt="Profilkép" style="border-radius: 50%" />
      <q-card-section class="">
        <div class="text-h6 text-center">
          {{ user.username }} #{{ user.id }}
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
    name: "SearchedUserPage",

    data() {
      return {
        user: null,
        userId: null,
        username: null,
        profilePictureURL: null,
      };
    },
    mounted() {
      this.userId = this.$route.params.id;

      this.getUserById();
    },
    methods: {
      async getUserById() {
        try {
          const response = await axios.get(`/api/users/${this.userId}`);
          this.user = response.data;
        } catch (error) {
          console.error("Error fetching user by id:", error);
        }
      }
    }
});
</script>