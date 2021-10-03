export default abstract class EntityParent {
  /** Converts the entity data into response object. Generally filters out
   * sensitive information from the data.
   */
  toResponseObject(): any {
    return this;
  }

  /** Names of the relation columns of the entity */
  static relations: string[] = [];
}
