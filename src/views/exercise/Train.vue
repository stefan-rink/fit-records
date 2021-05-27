<template>
  <section class="train-wrapper">
    <Header back="list" close="/">Train hard!</Header>

    <div class="train-content">
      <h1>{{ exercise.name }}</h1>
      <Slider class="slider" v-model:model-value="reps" unit="reps" />
      <Slider class="slider" v-model:model-value="weight" :delta="2.5" />
      <button class="btn" @click="addTrainingSet">Done</button>

      <ol>
        <li :key="trainingSet" v-for="trainingSet of trainingSets">
          {{ trainingSet.weight }} {{ trainingSet.reps }}
        </li>
      </ol>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/exercise/components/Header.vue";
import Slider from "@/views/exercise/components/Slider.vue";
import { Exercise } from "@/models/Exercise";
import store from "@/store";
import { TrainingSet } from "@/models/training-set";
import { Workout } from "@/models/Workout";

export default defineComponent({
  name: "Train",
  components: { Slider, Header },
  props: {
    exerciseId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      exercise: {} as Exercise,
      reps: 10,
      weight: 20,
      todaysWorkout: {} as Workout,
      trainingSets: [] as Array<TrainingSet>,
    };
  },
  methods: {
    async addTrainingSet() {
      // Add the new training set
      const trainingSet = new TrainingSet(
        this.todaysWorkout.id as number,
        this.exercise.id as number,
        this.reps,
        this.weight
      );
      await store.dispatch("addTrainingSet", trainingSet);

      // Get refreshed list of training sets of this exercise for the current workout
      this.trainingSets = await store.dispatch("getTrainingSets", [
        this.todaysWorkout.id,
        this.exercise.id,
      ]);
    },
  },
  async beforeCreate() {
    // Load the exercise whose id was passed by the router
    this.exercise = (await store.dispatch("getExercise", parseInt(this.exerciseId))) as Exercise;
    // Get the workout for the current day
    this.todaysWorkout = await store.dispatch("getWorkout");

    // Get list of already done sets in the workout and exercise
    this.trainingSets = await store.dispatch("getTrainingSets", [
      this.todaysWorkout.id,
      this.exercise.id,
    ]);
  },
});
</script>

<style scoped lang="less">
.train-wrapper {
  height: 100%;
  width: 100%;

  .train-content {
    padding: 16px;

    h1 {
      padding: 0;
    }

    .slider,
    h1 {
      margin-bottom: 8px;
    }
  }
}
</style>
