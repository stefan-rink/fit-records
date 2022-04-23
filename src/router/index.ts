import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import ExerciseList from "@/views/exercise/ExerciseList.vue";
import Train from "@/views/exercise/Train.vue";
import Home from "@/views/Home.vue";
import Exercise from "@/views/exercise/Exercise.vue";
import Records from "@/views/exercise/Records.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: {
      index: 0,
    },
  },
  {
    path: "/list",
    name: "ExerciseList",
    component: ExerciseList,
    meta: {
      index: 1,
    },
  },
  {
    path: "/train",
    name: "Train",
    component: Train,
    props: true,
    meta: {
      index: 2,
    },
  },
  {
    path: "/exercise",
    name: "Exercise",
    component: Exercise,
    props: true,
    meta: {
      index: 3,
    },
  },
  {
    path: "/records",
    name: "Records",
    component: Records,
    props: true,
    meta: {
      index: 4,
    },
  },
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
