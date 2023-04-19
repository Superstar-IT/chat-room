import { Column, Entity } from 'typeorm';

import { AbstractEntity } from 'src/core/entities/abstract.entity';

@Entity('chat_room')
export class ChatRoomEntity extends AbstractEntity {
  @Column({ type: 'uuid' })
  creator: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'jsonb', default: [] })
  members: string[];

  memberExists(member: string): boolean {
    const memberIds = new Set(this.members || []);
    return memberIds.has(member);
  }
}
