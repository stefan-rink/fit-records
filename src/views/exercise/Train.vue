<template>
  <section class="train-wrapper">
    <Header back="list" close="/">Train hard!</Header>

    <main>
      <div class="content">
        <h1>
          {{ exercise.name }} <span v-if="editing > -1">editing set no. {{ editing + 1 }}</span>
        </h1>
        <Slider class="slider" v-model:model-value="reps" unit="reps" />
        <Slider class="slider" v-model:model-value="weight" :delta="2.5" />
        <button class="btn" @click="addTrainingSet">Done</button>
        <button class="btn btn-delete" @click="deleteSet" v-if="editing > -1">Delete</button>

        <div class="already-finished-reps">
          <h2 v-if="trainingSets.length" class="train-sets-headline">Already finished</h2>
          <ol>
            <li :key="trainingSet" v-for="(trainingSet, index) of trainingSets">
              <div class="train-set-content">
                <span>{{ trainingSet.reps }} reps</span>
                <span>{{ trainingSet.weight }} kg</span>
                <span>
                  <svg class="icon" @click="editSet(index)">
                    <use :xlink:href="`${require('@/assets/icons.svg')}#edit`"></use>
                  </svg>
                </span>
              </div>
            </li>
          </ol>
        </div>

        <div class="last-set-done">
          <h2 v-if="lastSet.length" class="train-sets-headline">Last set done</h2>
          <ol>
            <li :key="exercise" v-for="exercise of lastSet">
              <div class="train-set-content">
                <span>{{ exercise.reps }} reps</span>
                <span>{{ exercise.weight }} kg</span>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/exercise/components/Header.vue";
import Slider from "@/views/exercise/components/Slider.vue";
import { Exercise } from "@/models/Exercise";
import store from "@/store";
import { TrainingSet } from "@/models/TrainingSet";
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
      lastSet: [] as Array<Exercise>,
      editing: -1, // -1 -> not editing, else the index of the editing training set
    };
  },
  methods: {
    async addTrainingSet() {
      // Create todays workout if not already done yet
      if (!this.todaysWorkout.id) {
        if (store.state.selectedWorkout && !store.state.selectedWorkout.id) {
          await store.dispatch("saveSelectedWorkout");
          // Get the newly created workout to have
          this.todaysWorkout = await store.dispatch("getWorkout");
        }
      }

      if (this.editing > -1) {
        await this.editTrainingSet();
        return;
      }

      // Add the new training set
      const trainingSet = new TrainingSet(
        this.todaysWorkout.id as number,
        this.exercise.id as number,
        this.reps,
        this.weight
      );
      await store.dispatch("addTrainingSet", trainingSet);

      // Get refreshed list of training sets of this exercise for the current workout
      await this.refreshList();
    },

    /**
     * Delete a training set
     */
    async deleteSet() {
      // Only possible to delete a set if editing one
      if (this.editing === -1) {
        await this.editTrainingSet();
        return;
      }

      await store.dispatch("deleteTrainingSet", this.trainingSets[this.editing].id);

      this.editing = -1;
      await this.refreshList();
    },

    /**
     * Refresh list
     */
    async refreshList() {
      this.trainingSets = await store.dispatch("getTrainingSets", [
        this.todaysWorkout.id,
        this.exercise.id,
      ]);

      await this.getLastExecutionParameters();
    },

    /**
     * Get weight and reps of the last execution of the selected exercise
     */
    async getLastExecutionParameters() {
      const trainingSet = await store.dispatch("getLastExerciseExecution", this.exercise.id);
      this.reps = trainingSet?.reps || 12;
      this.weight = trainingSet?.weight || 30;
    },

    /**
     * Start editing a training set
     */
    editSet(index: number) {
      this.editing = index;

      const trainingSet = this.trainingSets[this.editing];
      this.weight = trainingSet.weight;
      this.reps = trainingSet.reps;
    },

    /**
     * Update the training set which ist currently in edit mode
     */
    async editTrainingSet() {
      const trainingSet = this.trainingSets[this.editing];

      trainingSet.reps = this.reps;
      trainingSet.weight = this.weight;

      // Reassign the edited training set
      this.trainingSets[this.editing] = trainingSet;

      // Safe in db
      await store.dispatch("updateTrainingSet", trainingSet);

      // End editing
      this.editing = -1;
    },
  },

  async beforeCreate() {
    // Load the exercise whose id was passed by the router
    this.exercise = (await store.dispatch("getExercise", parseInt(this.exerciseId))) as Exercise;
    // Get the workout for the current day
    this.todaysWorkout = await store.dispatch("getWorkout");

    // Get last entry for chosen exercise to prefill input elements
    await this.getLastExecutionParameters();

    // Load additional information if a workout for today's has been created already
    if (this.todaysWorkout.id) {
      // Get list of already done sets in the workout and exercise
      this.trainingSets = await store.dispatch("getTrainingSets", [
        this.todaysWorkout.id,
        this.exercise.id,
      ]);

      this.lastSet = await store.dispatch("getLastSet", [this.exerciseId, this.todaysWorkout.id]);
    }
  },
});
</script>

<style scoped lang="less">
.btn-delete {
  margin-top: 8px;
}

main {
  padding-top: 8px;

  h1 {
    padding: 0;

    span {
      font-style: italic;
      font-size: 16px;
      color: #666;
    }
  }

  .slider,
  h1 {
    margin-bottom: 8px;
  }

  .train-sets-headline {
    margin-top: 48px;
  }

  ol {
    font-size: 20px;

    li .train-set-content {
      display: grid;
      max-width: 300px;
      grid-template-columns: 1fr 1fr 1fr;
      padding-left: 16px;

      .icon {
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
    }
  }
}
</style>
