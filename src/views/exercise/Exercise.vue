<template>
  <section>
    <Header :back="backRoute" close="/">Exercises</Header>

    <main>
      <div class="content">
        <h1 v-if="!exercise.id">Add new Exercise</h1>
        <h1 v-else>Edit Exercise</h1>

        <label>
          Name:
          <input type="text" placeholder="New Exercise" v-model="exercise.name" />
        </label>

        <button class="btn" @click="save">Save</button>
      </div>
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
    back: {
      type: String,
    },
    exerciseId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      exercise: new Exercise(""),
      backRoute: "list",
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
    if (this.back) {
      this.backRoute = JSON.parse(this.back);
    } else {
      this.backRoute = "list";
    }
  },
});
</script>

<style scoped lang="less"></style>
