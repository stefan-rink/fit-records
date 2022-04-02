<template>
  <section>
    <Header back="list" close="/">Exercises</Header>

    <main>
      <h1 v-if="!exercise.id">Add new Exercise</h1>
      <h1 v-else>Edit Exercise</h1>

      <label>
        Name:
        <input type="text" v-model="exercise.name" />
      </label>

      <button class="btn" @click="save">Save</button>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Exercise } from "@/models/Exercise";
import store from "@/store";
import Header from "@/views/exercise/components/Header.vue";

export default defineComponent({
  name: "Exercise",
  components: {
    Header,
  },
  props: {
    exerciseId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      exercise: new Exercise("New Exercise"),
    };
  },
  methods: {
    async save() {
      try {
        this.exercise.id = await store.dispatch("setExercise", this.exercise);
        // TODO: Show success toast
      } catch (e) {
        // TODO: Show error toast
      }
    },
  },
  async beforeCreate() {
    // If there is an exercise id passed by the router load the exercise
    if (this.exerciseId) {
      this.exercise = (await store.dispatch("getExercise", parseInt(this.exerciseId))) as Exercise;
    }
  },
});
</script>

<style scoped></style>
