import { Records } from "@/models/Records";
import { TrainingSet } from "@/models/TrainingSet";

export class RecordsWrapper {
  // Map<exerciseId, Map<reps, recordsModel>>
  exercises: Array<Array<Records>> = [];

  constructor(records: Records[]) {
    this.fromArray(records);
  }

  /**
   * Build the data structure from the array received from the indexeddb
   * @param records
   */
  fromArray(records: Records[]): void {
    records.forEach((record) => {
      if (!this.exercises[record.exerciseId]) {
        this.exercises[record.exerciseId] = [];
      }

      const recordsOfExercise = this.exercises[record.exerciseId];
      if (!recordsOfExercise[record.reps]) {
        recordsOfExercise[record.reps] = record;
      }
    });
  }

  toArray(): Records[] {
    return this.exercises.flat(2);
  }

  /**
   * Check whether a training set is a new personal record
   * @param trainingSet
   */
  isRecord(trainingSet: TrainingSet): boolean {
    if (!this.exercises[trainingSet.exerciseId]) return true;

    if (!this.exercises[trainingSet.exerciseId][trainingSet.reps]) return true;

    return this.exercises[trainingSet.exerciseId][trainingSet.reps].weight > trainingSet.weight;
  }

  /**
   * Append multiple sets to the data structure
   */
  appendAll(trainingSets: TrainingSet[]): void {
    trainingSets.forEach((trainingSet) => this.append(trainingSet));
  }

  /**
   * Add a new record to the managed data structure
   * @param trainingSet
   */
  append(trainingSet: TrainingSet): boolean {
    if (!this.isRecord(trainingSet)) return false;

    if (!this.exercises[trainingSet.exerciseId]) this.exercises[trainingSet.exerciseId] = [];

    this.exercises[trainingSet.exerciseId][trainingSet.reps] = new Records(
      Date.now(),
      trainingSet.exerciseId,
      trainingSet.reps,
      trainingSet.weight
    );
    return true;
  }
}
