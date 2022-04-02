import { createStore } from "vuex";
import { Workout } from "@/models/Workout";
import { Database } from "@/database";
import { Exercise } from "@/models/Exercise";
import { TrainingSet } from "@/models/training-set";

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

    /**
     * Returns all exercises
     */
    getExercises(context, exerciseIds: number[]): Promise<Exercise[]> {
      if (exerciseIds !== undefined) {
        return context.state.db.exercises.bulkGet(exerciseIds) as Promise<Exercise[]>;
      }
      return context.state.db.exercises.orderBy("name").toArray();
    },

    /**
     * Returns the exercise matching the id or undefined
     */
    getExercise(context, exerciseId: number): Promise<Exercise | undefined> {
      return context.state.db.exercises.get(exerciseId);
    },

    /**
     * Stores an exercise into the db
     * @return id of the entry
     */
    setExercise(context, exercise: Exercise): Promise<number> {
      return context.state.db.exercises.put(exercise);
    },

    /**
     * Add a new training set to the db
     */
    addTrainingSet(context, trainingSet: TrainingSet) {
      return context.state.db.trainingSets.put(trainingSet);
    },

    /**
     * Returns all trainings set matching the exercise of a specific workout
     */
    getTrainingSets(context, [workoutId, exerciseId]): Promise<TrainingSet[]> {
      // Build the filter object to gather the right training sets
      let filter = {};
      if (exerciseId) {
        filter = { workoutId: workoutId, exerciseId: exerciseId };
      } else {
        filter = { workoutId: workoutId };
      }

      return context.state.db.trainingSets.where(filter).toArray();
    },

    /**
     * Update a existing training set
     */
    async updateTrainingSet(context, trainingSet: TrainingSet): Promise<TrainingSet | null> {
      // If key is existing
      if (typeof trainingSet.id === "number") {
        // Clone object, without it could not be stored
        trainingSet = JSON.parse(JSON.stringify(trainingSet));
        // Update the entry
        await context.state.db.trainingSets.put(trainingSet);
        return trainingSet;
      }
      return null;
    },
  },
});
