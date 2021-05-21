<template>
  <section class="exercise-list">
    <Header close="/">Exercises</Header>

    <ul>
      <li><router-link to="train">Push-Ups</router-link></li>
      <li><router-link to="train">Bench Press</router-link></li>
      <li><router-link to="train">Deadlifts</router-link></li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Header from '@/views/exercise/components/Header.vue';

export default defineComponent({
  name: 'ExerciseList',
  components: { Header },
});
</script>

<style scoped lang="less">

.exercise-list {
  ul {
    list-style: none;
    padding: 0;

    li {
      font-size: 24px;
      padding: 8px 32px;

      a {
        color: #333;
        text-decoration: none;
      }
    }
  }
}

</style>
