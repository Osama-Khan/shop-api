export default abstract class EntityParent {
  toResponseObject: () => Partial<this> = () => this;
  static relations: string[] = [];
}
