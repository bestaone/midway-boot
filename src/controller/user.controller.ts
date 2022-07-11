import { Body, Controller, Inject, Post, Query } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { User } from '../entity/user';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';
import { RedisService } from '@midwayjs/redis';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@midwayjs/swagger';
import { encrypt } from '../utils/PasswordEncoder';
import { Assert } from '../common/Assert';
import { ErrorCode } from '../common/ErrorCode';
import { Page } from '../common/Page';

@ApiTags(['user'])
@ApiBearerAuth()
@Controller('/api/user')
export class UserController extends BaseController<User> {
  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cacheUtil: RedisService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @ApiResponse({ type: User })
  @Post('/create', { description: '创建' })
  async create(@Body() user: User): Promise<User> {
    Assert.isTrue(user.username !== null, ErrorCode.UN_ERROR, 'username不能为空');
    Assert.isTrue(user.password !== null, ErrorCode.UN_ERROR, 'password不能为空');
    Assert.isTrue(user.phoneNum !== null, ErrorCode.UN_ERROR, 'phoneNum不能为空');
    const { userId } = this.ctx.userContext;
    Object.assign(user, {
      regtime: new Date(),
      updaterId: userId,
      createrId: userId,
      password: encrypt(user.password),
    });
    const newUser = super.create(user);
    return Object.assign(newUser, { password: null });
  }

  @Post('/delete', { description: '删除' })
  async delete(@Query('id') id: number): Promise<boolean> {
    return super.delete(id);
  }

  @ApiResponse({ type: User })
  @Post('/update', { description: '更新' })
  async update(@Body() user: User): Promise<User> {
    return super.update(user);
  }

  @ApiResponse({ type: User })
  @Post('/findById', { description: '通过主键查找' })
  async findById(@Query('id') id: number): Promise<User> {
    return super.findById(id);
  }

  @ApiResponse({ type: User })
  @Post('/findByIds', { description: '通过一批主键查找' })
  async findByIds(@Body('ids') ids: number[]): Promise<User[]> {
    return super.findByIds(ids);
  }

  @ApiResponse({ type: User })
  @Post('/page', { description: '分页查询' })
  async page(@Body() map: Map<string, any>): Promise<Page<User>> {
    return super.page(map);
  }

  @ApiResponse({ type: User })
  @Post('/limit', { description: 'LIMIT查询' })
  async limit(@Body() map: Map<string, any>) {
    return super.limit(map);
  }

  @ApiResponse({ type: User })
  @Post('/findOne', { description: '查询一个' })
  async findOne(@Body() user: User): Promise<User> {
    return super.findOne(user);
  }
}
