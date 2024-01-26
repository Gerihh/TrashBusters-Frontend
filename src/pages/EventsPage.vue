<template>
<EventFilterComponent/>
</template>

<script>
import EventFilterComponent from "../components/EventFilterComponent.vue";
import { defineComponent } from 'vue';

export default defineComponent ({
  name: "EventsPage",
  components: { EventFilterComponent }
});
</script>