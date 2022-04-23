export class Records {
  /**
   * Stores the records of an exercise up to a specific time
   * TODO: Use to build prev maxes between now and date of records entry
   * @param timestamp
   * @param exerciseId
   * @param reps
   * @param weight
   */
  public constructor(
    public timestamp: number,
    public exerciseId: number,
    public reps: number,
    public weight: number
  ) {}
}
