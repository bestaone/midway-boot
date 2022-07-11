import {close, createApp, createHttpRequest} from '@midwayjs/mock';
import {Application, Framework} from '@midwayjs/koa';
import {ErrorCode} from "../../src/common/ErrorCode";
import {CommonController} from '../../src/controller/common.controller'
import {User} from '../../src/entity/user'
import {encrypt} from '../../src/utils/PasswordEncoder'
import {UserService} from '../../src/service/user.service'

describe('test/controller/user.test.ts', () => {

  let app: Application;
  let o: User;
  let at: string;
  let username='zhangsan', password = '123456';

  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
      // 初始化一个账号
      const userService = await app.getApplicationContext().getAsync<UserService>(UserService);
      let user: User = await userService.findByUsername(username);
      if (user == null) {
        user = new User();
        user = Object.assign(user, {
          username,
          password: encrypt(password),
          phoneNum: new Date().getTime().toString(),
          updaterId: 1,
          createrId: 1,
          regtime: new Date(),
        });
        const o = await userService.save(user);
        console.log(o)
      }
      // 获取一个访问凭证
      const commonController = await app.getApplicationContext().getAsync<CommonController>(CommonController);
      const loginVO = await commonController.login({username, password})
      at = loginVO.accessToken;
    } catch(err) {
      console.error('test beforeAll error', err);
      throw err;
    }
  });

  afterAll(async () => {
    await close(app);
  });

  // create
  it('should POST /api/user/create', async () => {
    o = new User();
    Object.assign(o, {
      username: new Date().getTime().toString(),
      password: new Date().getTime().toString(),
      phoneNum: new Date().getTime().toString()
    });
    const result = await createHttpRequest(app).post('/api/user/create')
      .set({'Authorization': 'Bearer ' + at})
      .send(o);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
    o = result.body.data;
  });

  // update
  it('should POST /api/user/update', async () => {
    o.username = new Date().getTime().toString();
    const result = await createHttpRequest(app).post('/api/user/update')
      .set({'Authorization': 'Bearer ' + at})
      .send(o);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
    o = result.body.data;
  });

  // findById
  it('should POST /api/user/findById', async () => {
    const result = await createHttpRequest(app).post('/api/user/findById?id=' + o.id)
      .set({'Authorization': 'Bearer ' + at});
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
    o = result.body.data;
  });

  // findByIds
  it('should POST /api/user/findByIds', async () => {
    const body = { ids: [o.id] }
    const result = await createHttpRequest(app).post('/api/user/findByIds')
      .set({'Authorization': 'Bearer ' + at})
      .send(body);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
  });

  // page
  it('should POST /api/user/page', async () => {
    const body = { pageNo: 1, pageSize: 10, username: o.username }
    const result = await createHttpRequest(app).post('/api/user/page')
      .set({'Authorization': 'Bearer ' + at})
      .send(body);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
  });

  // limit
  it('should POST /api/user/limit', async () => {
    const body = { offset: 1, limit: 10, username: o.username }
    const result = await createHttpRequest(app).post('/api/user/limit')
      .set({'Authorization': 'Bearer ' + at})
      .send(body);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
  });

  // findOne
  it('should POST /api/user/findOne', async () => {
    const body = { username: o.username }
    const result = await createHttpRequest(app).post('/api/user/findOne')
      .set({'Authorization': 'Bearer ' + at})
      .send(body);
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
  });

  // delete
  it('should POST /api/user/delete', async () => {
    const result = await createHttpRequest(app).post('/api/user/delete?id=' + o.id)
      .set({'Authorization': 'Bearer ' + at});
    expect(result.status).toBe(200);
    expect(result.body.code).toBe(ErrorCode.OK);
  });
});
