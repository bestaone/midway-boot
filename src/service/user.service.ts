import { Provide } from '@midwayjs/decorator';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { User } from '../entity/user';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';

@Provide()
export class UserService extends BaseService<User> {
  @InjectEntityModel(User)
  model: Repository<User>;

  getModel(): Repository<User> {
    return this.model;
  }

  async findByUsername(username: string): Promise<User> {
    return this.model.findOne({ where: { username } });
  }
}
