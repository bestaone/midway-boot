import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';
import { ApiProperty } from '@midwayjs/swagger';

@Entity('user')
export class User extends BaseEntity {
  @ApiProperty({ description: '头像' })
  @Column({ length: 100, nullable: true })
  avatarUrl: string;

  @ApiProperty({ description: '用户名' })
  @Column({ length: 20, unique: true })
  username: string;

  @ApiProperty({ description: '密码' })
  @Column({ length: 200 })
  password: string;

  @ApiProperty({ description: '手机号' })
  @Column({ length: 20 })
  phoneNum: string;

  @ApiProperty({ description: '注册时间' })
  @Column()
  regtime: Date;

  @ApiProperty({ description: '状态 0：不可用，1：正常' })
  @Column({ type: 'int', default: 1 })
  status: number;
}
