<template>
  <section>
    <Header :back="{ name: 'Train', params: { exerciseId: exerciseId } }" close="/">Records</Header>

    <main>
      <div class="content">
        <h1>Records for {{ exercise.name }}</h1>
        <ul v-if="records.length > 0">
          <li v-for="record in records" :key="record">
            <span>{{ record.reps }} reps</span><span>{{ record.weight }} kg</span>
          </li>
        </ul>
        <div v-else>No records recorded, keep going!</div>
      </div>
    </main>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Header from "@/views/exercise/components/Header.vue";
import store from "@/store";
import { Exercise } from "@/models/Exercise";
import { RecordsWrapper } from "@/RecordsWrapper";

export default defineComponent({
  components: { Header },
  name: "Records",
  props: {
    exerciseId: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      exercise: {} as Exercise,
      records: RecordsWrapper,
    };
  },
  async beforeCreate() {
    this.records = await store.dispatch("getCurrentRecords", parseInt(this.exerciseId));
    this.exercise = await store.dispatch("getExercise", parseInt(this.exerciseId));
  },
});
</script>

<style lang="less" scoped>
ul {
  padding-left: 0;
  list-style-type: none;

  li {
    display: grid;
    max-width: 300px;
    grid-template-columns: 1fr 1fr 1fr;
    padding-left: 16px;
  }
}
</style>
