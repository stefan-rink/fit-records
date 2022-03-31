import { createMemoryHistory, createRouter, RouteRecordRaw } from "vue-router";
import ExerciseList from "@/views/exercise/ExerciseList.vue";
import Train from "@/views/exercise/Train.vue";
import Home from "@/views/Home.vue";

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
];

const router = createRouter({
  history: createMemoryHistory(),
  routes,
});

export default router;
