import Dexie, { Transaction } from "dexie";
import { Workout } from "@/models/Workout";
import { TrainingSet } from "@/models/TrainingSet";
import { Exercise } from "@/models/Exercise";
import { Records } from "@/models/Records";

export class Database extends Dexie {
  workouts: Dexie.Table<Workout, number>;
  trainingSets: Dexie.Table<TrainingSet, number>;
  exercises: Dexie.Table<Exercise, number>;
  records: Dexie.Table<Records, number>;

  constructor() {
    super("database");

    // Make indexeddb database persistent
    navigator.storage && navigator.storage.persist && navigator.storage.persist();

    // Register indexeddb indices
    this.version(1).stores({
      workouts: "++id, &[year+month+day]",
      trainingSets: "++id, [workoutId+exerciseId]",
      exercises: "++id, &name",
    });

    this.version(3).stores({
      workouts: "++id, &[year+month+day]",
      trainingSets: "++id, [workoutId+exerciseId], [exerciseId+workoutId]",
      exercises: "++id, &name",
    });

    // Add records table
    this.version(10)
      .stores({
        workouts: "++id, &[year+month+day]",
        trainingSets: "++id, [workoutId+exerciseId], [exerciseId+workoutId], timestamp",
        exercises: "++id, &name",
        records: "++id, &[exerciseId+reps]",
      })
      .upgrade((transaction: Transaction) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return transaction.trainingSets.toCollection().modify((trainingSet: TrainingSet) => {
          trainingSet.timestamp = 0;
        });
      });

    this.workouts = this.table("workouts");
    this.trainingSets = this.table("trainingSets");
    this.exercises = this.table("exercises");
    this.records = this.table("records");

    // Initialize sample exercises
    this.initData().then();
  }

  async initData(): Promise<void> {
    if ((await this.exercises.count()) === 0) {
      this.exercises.add(new Exercise("Deadlifts"));
      this.exercises.add(new Exercise("Push Ups"));
      this.exercises.add(new Exercise("Squats"));
      this.exercises.add(new Exercise("Biceps Curls"));
      this.exercises.add(new Exercise("Skullcrushers"));
      this.exercises.add(new Exercise("Dumbbell Rows"));
    }
  }
}
