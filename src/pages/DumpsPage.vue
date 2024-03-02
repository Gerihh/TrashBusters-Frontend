<template>
  <DumpFilterComponent/>
</template>

<script>
import DumpFilterComponent from "src/components/DumpFilterComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
    name: "DumpsPage",
    components: { DumpFilterComponent }
});
</script>
