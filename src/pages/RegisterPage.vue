<template>
  <RegisterFormComponent/>
</template>

<script>
import RegisterFormComponent from "src/components/RegisterFormComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "RegisterPage",
    components: { RegisterFormComponent }
});
</script>