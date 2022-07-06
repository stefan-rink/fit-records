import { createStore } from "vuex";
import { Workout } from "@/models/Workout";
import { Database } from "@/database";
import { Exercise } from "@/models/Exercise";
import { TrainingSet } from "@/models/TrainingSet";
import store from "@/store";
import { RecordsWrapper } from "@/RecordsWrapper";
import { Records } from "@/models/Records";

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
    /**
     * Returns the workout object for today
     */
    async getWorkout(context): Promise<Workout> {
      // Today's date, to specify the workout
      const todayDate = new Date();

      context.commit(
        "setSelectedWorkout",
        (await context.state.db.workouts.get({
          year: todayDate.getFullYear(),
          month: todayDate.getMonth() + 1,
          day: todayDate.getUTCDate(),
        })) ??
          new Workout(todayDate.getUTCDate(), todayDate.getMonth() + 1, todayDate.getFullYear())
      );

      return context.state.selectedWorkout as Workout;
    },

    /**
     * Get the workout before the workout with the given id (currentWorkoutId)
     */
    async getPreviousWorkout(
      context,
      currentWorkoutId = Number.MAX_SAFE_INTEGER
    ): Promise<Workout> {
      // TODO: Change to date instead of ID?
      const workout = await this.state.db.workouts.where("id").below(currentWorkoutId).last();

      if (!workout) {
        throw new Error("Could not get prev workout");
      }

      context.commit("setSelectedWorkout", workout);

      return workout;
    },

    /**
     * Get the workout before the workout with the given id (currentWorkoutId)
     */
    async getNextWorkout(context, currentWorkoutId: number) {
      // TODO: Change to date instead of ID?
      const workout = await this.state.db.workouts.where("id").above(currentWorkoutId).first();

      if (!workout) {
        return context.dispatch("getWorkout");
      }

      context.commit("setSelectedWorkout", workout);

      return workout;
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
     * Delete training set entry from db
     */
    deleteTrainingSet(context, trainingSetId) {
      return context.state.db.trainingSets.delete(trainingSetId);
    },

    /**
     * Returns all trainings set matching the exercise of a specific workout
     */
    getTrainingSets(context, [workoutId, exerciseId]): Promise<TrainingSet[]> {
      // Build the filter object to gather the right training sets
      const filter: { workoutId?: number; exerciseId?: number } = {};

      if (exerciseId) {
        filter["exerciseId"] = exerciseId;
      }

      if (workoutId) {
        filter["workoutId"] = workoutId;
      }

      return context.state.db.trainingSets.where(filter).toArray();
    },

    /**
     * Return the latest training set entry to determine the parameters of the last execution
     */
    async getLastExerciseExecution(
      context,
      exerciseId: string | number
    ): Promise<TrainingSet | undefined> {
      exerciseId = typeof exerciseId === "string" ? parseInt(exerciseId) : exerciseId;
      return await store.state.db.trainingSets.where({ exerciseId: exerciseId }).last();
    },

    /**
     * Update an existing training set
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

    /**
     * Returns the set of an exercise from the previous workout
     */
    async getLastSet(context, [exerciseId, currentWorkoutId]): Promise<TrainingSet[]> {
      if (!currentWorkoutId) {
        currentWorkoutId = Number.MAX_SAFE_INTEGER;
      }

      const set = await context.state.db.trainingSets
        .where("exerciseId")
        .equals(parseInt(exerciseId))
        .and((trainingSet) => trainingSet.workoutId < currentWorkoutId)
        .last();

      const workoutId = set?.workoutId;
      if (!workoutId) return [];

      return context.state.db.trainingSets
        .where({ workoutId: workoutId, exerciseId: parseInt(exerciseId) })
        .toArray();
    },

    /**
     * Refreshes the records table
     */
    async buildRecords(context) {
      const lastRecordsTimestamp = parseInt(
        window.localStorage.getItem("records-timestamp") || "0"
      );

      const recordsWrapper = new RecordsWrapper(
        (await context.state.db.records.orderBy("exerciseId").toArray()) || []
      );

      const currentWorkout: Workout = await store.dispatch("getWorkout");

      // Get all training sets between last indexing and the beginning of the current workout
      const setsSinceLastRebuild = await context.state.db.trainingSets
        .where("timestamp")
        .between(lastRecordsTimestamp, Workout.getTimestamp(currentWorkout))
        .toArray();

      // Add all new records to the data structure
      recordsWrapper.appendAll(setsSinceLastRebuild);

      // Refresh records table in indexeddb
      await context.state.db.records.bulkPut(recordsWrapper.toArray());

      window.localStorage.setItem("records-timestamp", Date.now().toString());
    },

    /**
     * Returns all records or records of specific exercise if id is given
     */
    async getCurrentRecords(context, exerciseId = -1): Promise<Records[]> {
      // Today's workout
      const workout: Workout = await context.dispatch("getWorkout");

      // Previous records from the indexeddb
      let records: Records[];

      // Exercises of the current workout that should be added to current records
      let additionalExercises: TrainingSet[];

      if (exerciseId > 0) {
        records =
          (await context.state.db.records.where("exerciseId").equals(exerciseId).toArray()) || [];
      } else {
        records = (await context.state.db.records.orderBy("exerciseId").toArray()) || [];
      }

      // Build records data structure
      const recordsWrapper = new RecordsWrapper(records);

      // If today's workout is already started, use its sets to calculate current records
      if (workout.id) {
        additionalExercises = await context.dispatch("getTrainingSets", [
          workout.id,
          exerciseId == -1 ? null : exerciseId,
        ]);
        recordsWrapper.appendAll(additionalExercises);
      }

      return recordsWrapper.toArray();
    },
  },
});
