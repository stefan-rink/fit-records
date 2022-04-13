export class RecordsOfExercise {
  /**
   * Stores the records of an exercise up to a specific time
   * TODO: Use to build prev maxes between now and date of records entry
   * @param day
   * @param month
   * @param year
   * @param exerciseId
   * @param records List of [reps: weight] pairs which stores the max weight for an amount of reps
   */
  public constructor(
    public day: number,
    public month: number,
    public year: number,
    public exerciseId: number,
    public records: Record<number, number>
  ) {}
}
