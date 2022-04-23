export class Workout {
  /**
   * A workout; groups all sets done on a day
   */
  public constructor(
    public day: number,
    public month: number,
    public year: number,
    public id?: number
  ) {}

  /**
   * Returns the timestamp of the beginning of the workout (midnight)
   */
  static getTimestamp(workout: Workout): number {
    return new Date(`${workout.year}-${workout.month}-${workout.day}`).valueOf();
  }
}
