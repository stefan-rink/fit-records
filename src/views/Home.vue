<template>
  <section>
    <header>
      <h1>Today</h1>
    </header>

    <div class="home-content">
      <div class="exercise" v-for="exercise of exercises" :key="exercise">
        <h2>{{ exercise.name }}</h2>
        <ol>
          <li class="train-set" v-for="trainingSet of trainingSets[exercise.id]" :key="trainingSet">
            <div class="train-set-content">
              <span>{{ trainingSet.reps }} reps</span><span>{{ trainingSet.weight }} kg</span>
            </div>
          </li>
        </ol>
      </div>
    </div>

    <nav class="bottom-toolbar">
      <router-link to="list">
        <svg class="add-icon">
          <use :xlink:href="`${require('@/assets/icons.svg')}#add`"></use>
        </svg>
      </router-link>
    </nav>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import store from "@/store";
import { Workout } from "@/models/Workout";
import { TrainingSet } from "@/models/training-set";
import { Exercise } from "@/models/Exercise";

export default defineComponent({
  name: "Home",
  components: {},
  data() {
    return {
      workout: {} as Workout,
      exercises: [] as Array<Exercise>,
      trainingSets: [] as Array<TrainingSet[]>,
    };
  },
  async beforeCreate() {
    // Get workout for current day
    this.workout = await store.dispatch("getWorkout");

    // Skip if no workout is available in the database
    if (!this.workout.id) {
      return;
    }

    // Get the workouts training sets
    const trainingSets: TrainingSet[] = await store.dispatch("getTrainingSets", [
      this.workout.id,
      undefined,
    ]);

    // Get all exercises down in the specific workout
    this.exercises = await store.dispatch(
      "getExercises",
      trainingSets
        .map((set) => set.exerciseId) // Get only exerciseIds
        .filter((exerciseId, index, array) => array.indexOf(exerciseId) == index) // Unique values
    );

    // Group the training sets by the exercises
    this.exercises.forEach((exercise) => {
      this.trainingSets[exercise.id as number] = trainingSets.filter(
        (trainingSet) => trainingSet.exerciseId === exercise.id
      );
    });
  },
});
</script>

<style scoped lang="less">
section {
  height: 100vh;
}

header {
  background-color: #e4e4e4;
  height: 80px;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  position: fixed;
  top: 0;
  right: 0;
  left: 0;

  h1 {
    text-align: center;
  }
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: 64px;
  background: #e4e4e4;
  display: flex;
  justify-content: center;
  align-items: center;
}

.home-content {
  margin-top: 80px;
  padding: 16px;

  .exercise {
    margin: 16px 0;
    padding: 0 16px;
    border-left: 12px solid #e4e4e4;

    h2 {
      font-size: 28px;
      margin: 0;
    }

    ol {
      margin: 0;

      .train-set-content {
        display: grid;
        max-width: 300px;
        grid-template-columns: 1fr 1fr 1fr;
        padding-left: 16px;
      }
    }
  }
}

svg.add-icon {
  width: 32px;
  height: 32px;
}
</style>
