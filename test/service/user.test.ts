import {close, createApp} from '@midwayjs/mock';
import {Application, Framework} from '@midwayjs/koa';
import {User} from '../../src/entity/user'
import {ErrorCode} from '../../src/common/ErrorCode'
import {UserService} from '../../src/service/user.service'
import {encrypt} from '../../src/utils/PasswordEncoder'
import {Assert} from '../../src/common/Assert';
import {Page} from '../../src/common/Page'

describe('test/service/user.test.ts', () => {

  let app: Application;
  let service: UserService;

  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
      service = await app.getApplicationContext().getAsync<UserService>(UserService);
    } catch(err) {
      console.error('test beforeAll error', err);
      throw err;
    }
  });

  afterAll(async () => {
    await close(app);
  });

  // CRUD
  it('test service.crud', async () => {

    // create
    const username = new Date().getTime().toString();
    let o = new User();
    o = Object.assign(o, {
      username,
      password: encrypt(new Date().getTime().toString()),
      phoneNum: new Date().getTime().toString(),
      updaterId: 1,
      createrId: 1,
      regtime: new Date(),
    });
    await service.save(o);
    Assert.notEmpty(o.id, ErrorCode.UN_ERROR, '创建用户失败');

    // find
    o = await service.findById(o.id);
    Assert.notNull(o, ErrorCode.UN_ERROR, '查询失败');

    // update
    const phoneNum = new Date().getTime().toString();
    o.phoneNum = phoneNum;
    await service.save(o);
    o = await service.findById(o.id);
    Assert.isTrue(o.phoneNum===phoneNum, ErrorCode.UN_ERROR, '更新失败');

    // page
    const page: Page<User> = await service.page({}, 1, 10);
    Assert.isTrue(page.total>0, ErrorCode.UN_ERROR, '分页查询失败');

    // limit
    const list: User[] = await service.limit({}, 0, 10);
    Assert.isTrue(list.length>0, ErrorCode.UN_ERROR, 'LIMIT查询失败');

    // delete
    await service.delete(o.id);
    o = await service.findById(o.id);
    Assert.notNull(!o, ErrorCode.UN_ERROR, '删除失败');

  });

});
