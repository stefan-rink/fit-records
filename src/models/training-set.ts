export class TrainingSet {
  /**
   * Represents one set done of one exercise with given weight and repetitions
   */
  public constructor(
    public workoutId: number,
    public exerciseId: number,
    public reps: number,
    public weight: number
  ) {}
}
