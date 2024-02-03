<template>
<div class="absolute-center">
    <q-card
      square
      bordered
      class="q-pa-md shadow-1"
      style="width: 300px;"
    >
      <q-form class="q-gutter-md">
        <q-input
          square
          filled
          clearable
          v-model="searchInput"
          type="text"
          label="#Azonosító"
        />
        <q-card-section>
          <q-btn
            unelevated
            color="light-green-7"
            size="lg"
            class="full-width"
            label="Keresés"
            @click="searchUser"
          />
        </q-card-section>
      </q-form>
    </q-card>
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent } from "vue";

export default defineComponent({
    name: "UsersPage",

    data() {
      return {
        searchInput: "",
        foundUser: null,
      };
    },
    methods: {
      async searchUser() {
        try {
          if (this.searchInput.startsWith("#")) {
          const cleanedInput = this.searchInput ? this.searchInput.substring(1) : this.searchInput;
          const response = await axios.get(`/api/users/${cleanedInput}`);
          this.foundUser = response.data;

          this.$router.push(`/user/${this.foundUser.id}`);;
          } else {
            alert("A megadott azonosító nem megfelelő formátumú!");
            this.searchInput = "";
          }
        } catch (error) {
          alert("Nincs felhasználó ilyen azonosítóval!");
          console.error("Error fetching user by id:", error);
          this.searchInput = "";
          this.foundUser = null;
        }
      }
    }
});
</script>