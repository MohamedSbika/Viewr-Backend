import { PartialType } from '@nestjs/mapped-types';
export function SafePartialType<T>(classRef: new (...args: any[]) => T) {
  if (!classRef) {
    throw new Error('SafePartialType: classRef is undefined!');
  }
  return PartialType(classRef);
}
