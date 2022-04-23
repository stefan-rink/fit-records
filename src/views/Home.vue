<template>
  <section>
    <header>
      <div class="switch-workout" @click="previousWorkout">
        <svg>
          <use :xlink:href="`${require('@/assets/icons.svg')}#back`"></use>
        </svg>
      </div>
      <h1>{{ getWorkoutDate() }}</h1>
      <div class="switch-workout" @click="nextWorkout">
        <svg>
          <use :xlink:href="`${require('@/assets/icons.svg')}#forward`"></use>
        </svg>
      </div>
    </header>

    <main class="home-content">
      <div class="content">
        <template v-if="exercises.length">
          <div
            class="exercise"
            v-for="exercise of exercises"
            :key="exercise"
            @click="openTrainingSet(exercise.id)"
          >
            <h2>{{ exercise.name }}</h2>
            <ol>
              <li
                class="train-set"
                v-for="trainingSet of trainingSets[exercise.id]"
                :key="trainingSet"
              >
                <div class="train-set-content">
                  <span>{{ trainingSet.reps }} reps</span><span>{{ trainingSet.weight }} kg</span>
                </div>
              </li>
            </ol>
          </div>
        </template>
        <div v-else>
          <img
            class="empty-log-image"
            alt="Empty log"
            :src="`${require('@/assets/undraw_empty.svg')}`"
          />
        </div>
      </div>
    </main>

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
import { TrainingSet } from "@/models/TrainingSet";
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

    await this.fetchExercises();
  },
  methods: {
    async fetchExercises() {
      // Skip if no workout is available in the database
      if (!this.workout.id) {
        this.exercises = [];
        return;
      }

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

    // Loads an already started set
    async openTrainingSet(exerciseId: number) {
      if (!this.isTodaysWorkout()) return;
      await this.$router.push({ name: "Train", params: { exerciseId } });
    },

    async nextWorkout() {
      this.workout = await store.dispatch("getNextWorkout", this.workout.id);

      await this.fetchExercises();
    },

    async previousWorkout() {
      this.workout = await store.dispatch("getPreviousWorkout", this.workout.id);

      await this.fetchExercises();
    },

    getWorkoutDate() {
      if (this.isTodaysWorkout()) {
        return "Today";
      }
      return `${this.workout.day}.${this.workout.month}.${this.workout.year}`;
    },

    isTodaysWorkout() {
      const date = new Date();

      return (
        this.workout.day == date.getUTCDate() &&
        this.workout.month == date.getMonth() + 1 &&
        this.workout.year == date.getFullYear()
      );
    },
  },
});
</script>

<style scoped lang="less">
@import "variables";

@header-height: 80px;

section {
  height: 100%;
  padding-top: @header-height;
  padding-bottom: calc(@footer-height + calc(env(safe-area-inset-bottom) / 4));
  margin: 0 auto;
}

header {
  background-color: #e4e4e4;
  height: @header-height;
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

  & > div {
    cursor: pointer;
    margin: 0 48px 10px;
  }
}

.bottom-toolbar {
  position: fixed;
  bottom: 0;
  right: 0;
  left: 0;
  height: @footer-height;
  background: #e4e4e4;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: calc(env(safe-area-inset-bottom) / 4);
}

.home-content {
  padding: 8px 16px;
  height: 100%;

  .exercise {
    margin: 16px 0;
    padding: 0 16px;
    border-left: 12px solid #e4e4e4;

    &:first-child {
      margin-top: 0;
    }

    &:last-child {
      margin-bottom: 0;
    }

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

  .empty-log-image {
    display: block;
    height: auto;
    width: 60%;
    max-width: 200px;
    margin: 80px auto 0;
    opacity: 0.3;
  }
}

svg.add-icon {
  width: 32px;
  height: 32px;
}
</style>
