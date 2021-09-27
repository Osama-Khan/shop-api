export default abstract class EntityParent {
  toResponseObject(): any {
    return this;
  }
  static relations: string[] = [];
}
