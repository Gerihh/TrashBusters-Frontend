<template>
   <div class="q-ma-lg flex justify-center" style="width: 100%;">
    <CreateEventComponent  style="width: 100%;" />
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

