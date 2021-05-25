<template>
  <section class="exercise-list">
    <Header close="/">Exercises</Header>

    <ul>
      <li v-for="exercise in exercises" :key="exercise">
        <router-link :to="{ path: 'train', params: { exerciseId: exercise.id } }">
          {{ exercise.name }}
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/exercise/components/Header.vue";
import store from "@/store";
import { Exercise } from "@/models/Exercise";

export default defineComponent({
  name: "ExerciseList",
  components: { Header },
  async beforeCreate() {
    // Add the new workout if not done yet TODO: move to training set
    if (store.state.selectedWorkout && !store.state.selectedWorkout.id) {
      await store.dispatch("saveSelectedWorkout");
    }

    // Load all exercise
    this.exercises = await store.dispatch("getExercises");
  },
  data() {
    return {
      exercises: [] as Array<Exercise>,
    };
  },
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
