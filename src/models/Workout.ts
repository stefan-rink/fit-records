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
}
