import { Repository } from 'typeorm';
import { Entities } from '../enums';

export class BaseAuthRepo<Entity> {
  constructor(private readonly repository: Repository<Entity>) {}
  async validate(id: string): Promise<Entity> {
    const qb = this.repository
      .createQueryBuilder('entity')
      .where('entity.id = :id', { id })
      .select([
        'entity.id',
        'entity.name',
        'entity.email',
        'entity.passwordChangedAt',
        'entity.createdAt',
        'entity.updatedAt',
        'role.id',
        'role.name',
        'permissions.id',
        'permissions.action',
        'permissions.subject',
      ])
      .leftJoin('entity.role', 'role')
      .leftJoin('role.permissions', 'permissions')

      .leftJoinAndSelect('entity.photos', 'photos');
    if (this.repository.metadata.name === Entities.User) {
      qb.leftJoinAndSelect('entity.wallet', 'wallet')
    }

    const person = await qb.getOne();
    return person;
  }
}
