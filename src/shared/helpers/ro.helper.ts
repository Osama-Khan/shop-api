import EntityParent from '../models/entity-parent.model';

/**
 * Generates a response object from an entity using it's toResponseObject function
 * @param input Entity to generate response from
 */
export default function generateRO(input: any): any {
  const entites: EntityParent[] = [].concat(input);
  const entity = entites.map((e) => e.toResponseObject());
  return entity.length === 1 ? entity[0] : entity;
}
