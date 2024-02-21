<template>
  <div class="q-ma-lg flex justify-center">
    <CreateEventComponent />
  </div>
</template>

<script>
import CreateEventComponent from "src/components/CreateEventComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ProfileEventsPage",
  components: { CreateEventComponent },
});
</script>
