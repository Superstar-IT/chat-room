'use strict';

import {
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  AfterLoad,
  BaseEntity,
} from 'typeorm';
import { instanceToPlain } from 'class-transformer';

export abstract class AbstractEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  __entity?: string;

  toJSON() {
    return instanceToPlain(this);
  }

  @AfterLoad()
  setEntityName() {
    this.__entity = this.constructor.name;
  }
}
