import { BadRequestException, PipeTransform } from '@nestjs/common';

export class RelationsValidationPipe implements PipeTransform {
  /**
   * @param relations string array of possible relations
   */
  constructor(private relations?: string[]) {}
  transform(relations) {
    if (relations && this.relations) {
      const f = relations.split(';');
      if (f.some((f) => !this.relations.includes(f))) {
        throw new BadRequestException('Invalid includes provided!');
      }
      relations = f;
    }
    return relations;
  }
}
