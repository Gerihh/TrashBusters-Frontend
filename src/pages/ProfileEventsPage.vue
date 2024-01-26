<template>
  <CreateEventComponent/>
</template>

<script>
import CreateEventComponent from "src/components/CreateEventComponent.vue"
import { defineComponent } from "vue";

export default defineComponent({
    name: "ProfileEventsPage",
    components: { CreateEventComponent },
});
</script>