import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from 'src/core/entities/abstract.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { ChatRoomEntity } from './chat-room.entity';

@Entity('chat_history')
export class ChatHistoryEntity extends AbstractEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn()
  sender: UserEntity;

  @ManyToOne(() => ChatRoomEntity)
  @JoinColumn()
  room: ChatRoomEntity;
}
