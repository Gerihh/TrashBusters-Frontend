<template>
  <LoginFormComponent/>
</template>

<script>
import LoginFormComponent from "src/components/LoginFormComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "LoginPage",
    components: { LoginFormComponent }
});
</script>
