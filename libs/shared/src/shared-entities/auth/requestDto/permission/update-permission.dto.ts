import { CRUD } from '@app/shared';

export class UpdatePermissionDto {
  id: string;
  action?: CRUD;
}