<template>
  <ExampleComponent />
</template>

<script>
import ExampleComponent from "src/components/ExampleComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "IndexPage",
  components: { ExampleComponent },
});
</script>
