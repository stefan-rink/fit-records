<template>
  <section class="exercise-list">
    <Header close="/">Exercises</Header>
    <label class="search-bar">
      <input v-model.trim="searchString" type="text" />
      <svg class="clear-search" v-if="searchString.length > 0" @click="searchString = ''">
        <use :xlink:href="`${require('@/assets/icons.svg')}#close`"></use>
      </svg>
    </label>

    <ul>
      <li v-for="exercise in filteredExercises" :key="exercise">
        <router-link :to="{ name: 'Train', params: { exerciseId: exercise.id } }">
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
      searchString: "",
    };
  },
  computed: {
    filteredExercises(): Exercise[] {
      return this.exercises.filter((exercise) => exercise.name.includes(this.searchString));
    },
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

.search-bar {
  display: block;
  width: 100%;
  padding: 0 32px;
  margin-top: 32px;
  position: relative;

  input[type="text"] {
    display: block;
    width: 100%;
  }

  svg.clear-search {
    position: absolute;
    padding: 8px;
    top: 0;
    right: 32px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }
}
</style>
