<template>
  <section class="exercise-list">
    <Header close="/">Exercises</Header>
    <main>
      <div class="search-bar">
        <label>
          <input placeholder="Search..." v-model.trim="searchString" type="text" />
          <svg class="search-bar-icon" v-if="searchString.length > 0" @click="searchString = ''">
            <use :xlink:href="`${require('@/assets/icons.svg')}#close`"></use>
          </svg>
          <svg class="search-bar-icon" v-else>
            <use :xlink:href="`${require('@/assets/icons.svg')}#search`"></use>
          </svg>
        </label>

        <router-link class="add-exercise" :to="{ name: 'Exercise', params: { exerciseId: null } }">
          <svg class="add-icon">
            <use :xlink:href="`${require('@/assets/icons.svg')}#add`"></use>
          </svg>
        </router-link>
      </div>

      <ul>
        <li v-for="exercise in filteredExercises" :key="exercise">
          <router-link :to="{ name: 'Train', params: { exerciseId: exercise.id } }">
            {{ exercise.name }}
          </router-link>
        </li>
      </ul>
    </main>
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
  display: flex;
  gap: 8px;
  width: 100%;
  padding: 0 32px;
  margin-top: 24px;
  position: relative;

  label {
    position: relative;
    width: 100%;
  }

  input[type="text"] {
    display: block;
    width: 100%;
    border-radius: 0;
    padding: 2px;
  }

  svg.search-bar-icon {
    position: absolute;
    padding: 8px;
    top: 0;
    right: 8px;
    width: 32px;
    height: 32px;
    cursor: pointer;
  }

  .add-exercise {
    color: #333;
    padding: 1px 0 0;
    display: flex;
    text-decoration: none;
    font-size: 20px;

    .add-icon {
      padding: 4px;
      width: 28px;
      height: 28px;
    }
  }
}
</style>
