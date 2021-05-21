<template>
  <section class="train-wrapper">
    <Header back="list" close="/">Train hard!</Header>

  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/views/exercise/components/Header.vue';

export default defineComponent({
  name: 'Train',
  components: { Header },
});
</script>

<style scoped lang="less">
.train-wrapper {
  height: 100%;
  width: 100%;
}
</style>
