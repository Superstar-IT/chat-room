import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '../../core/entities/abstract.entity';

@Entity('users')
export class UserEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', nullable: true })
  lastName?: string;
}
