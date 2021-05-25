<template>
  <section class="train-wrapper">
    <Header back="list" close="/">Train hard!</Header>

    <div class="train-content">
      <h1>Push Ups</h1>
      <Slider v-model:model-value="reps" unit="reps" />
      <Slider :delta="2.5" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/exercise/components/Header.vue";
import Slider from "@/views/exercise/components/Slider.vue";

export default defineComponent({
  name: "Train",
  components: { Slider, Header },
  data() {
    return {
      reps: 10,
    };
  },
});
</script>

<style scoped lang="less">
.train-wrapper {
  height: 100%;
  width: 100%;

  .train-content {
    padding: 8px;
  }
}
</style>
