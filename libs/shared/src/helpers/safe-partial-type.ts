import { PartialType } from '@nestjs/swagger';

export function SafePartialType<T>(classRef: new (...args: any[]) => T) {
  if (!classRef) {
    throw new Error('SafePartialType: classRef is undefined!');
  }
  return PartialType(classRef);
}
