import { createStore } from "vuex";
import { Workout } from "@/models/Workout";
import { Database } from "@/database";
import { Exercise } from "@/models/Exercise";

export class RootState {
  /**
   * Dexie instance to access the indexeddb
   */
  public db: Database;

  /**
   * Stores the workout for the selected day
   */
  public selectedWorkout?: Workout;

  public constructor() {
    // Init database connection
    this.db = new Database();
  }
}

export default createStore({
  state: new RootState(),
  mutations: {
    setSelectedWorkout(state, payload: Workout) {
      state.selectedWorkout = payload;
    },
  },
  actions: {
    async getWorkout(context): Promise<Workout> {
      // Today's data, to specify the workout
      const todayDate = new Date();

      context.commit(
        "setSelectedWorkout",
        (await context.state.db.workouts.get({
          year: todayDate.getFullYear(),
          month: todayDate.getMonth(),
          day: todayDate.getUTCDate(),
        })) ?? new Workout(todayDate.getUTCDate(), todayDate.getMonth(), todayDate.getFullYear())
      );

      return context.state.selectedWorkout as Workout;
    },

    async saveSelectedWorkout(context) {
      if (context.state.selectedWorkout)
        return await context.state.db.workouts.put(context.state.selectedWorkout);
    },

    getExercises(context): Promise<Exercise[]> {
      return context.state.db.exercises.toArray();
    },

    getExercise(context, exerciseId: number): Promise<Exercise | undefined> {
      return context.state.db.exercises.get(exerciseId);
    },
  },
});
