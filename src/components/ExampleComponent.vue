<template>
  <h1>hello</h1>
  <div v-if="error">Error occured!: {{ error.message }}</div>
  <div v-else-if="userData">
    <div v-for="{ id, username, email } in userData" :key="id">
      <h2>
        {{ id }}
        {{ username }}
        {{ email }}
      </h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import useUser from "../composables/userApi";
const { userData, error, getAllUser } = useUser();
onMounted(getAllUser);
</script>


