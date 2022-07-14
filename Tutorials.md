
## 课程简介
midway是阿里巴巴开源的，基于TypeScript语言开发的Nodejs后端框架。

#### 其遵循遵循两种编程范式：
- 面向对象（OOP + Class + IoC）；
- 函数式（FP + Function + Hooks）；

#### 谁较容易上手学习
- 懂Nodejs技术的前端开发；
- 会TypeScript的后端开发；

## midway、midway-boot介绍

## 环境准备

- Nodejs 12+
- Npm 8+
- MySql 5+
- Redis

### 开发工具
我们这里使用 IntelliJ IDEA
>下载地址：https://www.jetbrains.com/zh-cn/idea/download

### 安装数据库、Redis

## 第一个midway标准项目
#### 初始化创建
```bash
>npm init midway
```
- 执行命令后，需要选择模板，标准项目需要选择：koa-v3；
- 项目名可以自定义（我这里设置为midway-boot）；
#### 启动
```bash
>cd midway-boot
>npm run dev
```
>启动后浏览器访问：http://127.0.0.1:7001

#### 调整ESLint配置
```typescript
// .prettierrc.js
module.exports = {
  ...require('mwts/.prettierrc.json'),
  endOfLine: "lf",        // 换行符使用 lf
  printWidth: 120,        // 一行最多 120 字符
  proseWrap: "preserve",  // 使用默认的折行标准
  semi: true,             // 行尾需要有分号
}
```

### 项目结构介绍
```
├─src                     # 源码目录
│  ├─config               # 配置
│  ├─controller           # 控制器
│  ├─entity               # 数据对象模型
│  ├─filter               # 过滤器
│  ├─middleware           # 中间件
│  ├─service              # 服务类
│  ├─configurations.ts    # 服务生命周期管理及配置
│  └─interface.ts         # 接口定义
├─test                    # 测试类目录
├─bootstrap.js            # 启动入口
├─package.json            # 包管理配置
├─tsconfig.json           # TypeScript 编译配置文件
```

## 增删改查
### ORM模块TypeORM
TypeORM是Object Relation Mapping工具，提供的数据库操作能力。
#### 安装依赖
```bash
>npm i @midwayjs/orm@3 typeorm --save
```
安装完后`package.json`文件中会多出如下配置
```json
{
  "dependencies": {
    "@midwayjs/orm": "^3.3.6",
    "typeorm": "^0.3.7"
  }
}
```

#### 引入组件
在`src/configuration.ts`中引入 orm 组件
```typescript
// configuration.ts
import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/orm';

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([ReportMiddleware]);
  }
}
```

#### 添加数据库配置
修改配置`src/config/config.default.ts`
```typescript
// src/config/config.default.ts
import { MidwayConfig } from '@midwayjs/core';

export default {
  keys: '1657707214114_9253',
  koa: {
    port: 7001,
  },
  // 添加orm配置
  orm: {
    type: 'mysql',
    host: '127.0.0.1',      // 改成你的mysql数据库IP
    port: 3306,             // 改成你的mysql数据库端口
    username: 'root',       // 改成你的mysql数据库用户名（需要有创建表结构权限）
    password: '123456',     // 改成你的mysql数据库密码
    database: 'midway_boot',// 改成你的mysql数据库IP
    synchronize: true,      // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: true,
  },
} as MidwayConfig;
```
>注意：首次启动没有创建表结构的，需要设置自动创建表接口`synchronize: true`

#### 安装MySql驱动
```bash
>npm install mysql2 --save
```
安装完后`package.json`文件中会多出如下配置
```json
{
  "dependencies": {
    "mysql2": "^2.3.3"
  }
}
```

#### 创建Entity实体类
- 创建目录`src/entity`;
- 在该目录下创建实体类`user.ts`;
```typescript
// src/entity/user.ts
import { EntityModel } from '@midwayjs/orm';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@EntityModel('user')
export class User {

  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ length: 100, nullable: true })
  avatarUrl: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ length: 20 })
  phoneNum: string;

  @Column()
  regtime: Date;

  @Column({ type: 'bigint' })
  updaterId: number;

  @Column({ type: 'bigint' })
  createrId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;

  @Column({ type: 'int', default: 1 })
  status: number;

}
```
- `@EntityModel` 用来定义一个实体类；
- `@Column` 用来描述类的一个熟悉，对应数据库就是一个数据列；
- `@PrimaryColumn` 用来定义一个主键，每个实体类必须要要主键；
- `@PrimaryGeneratedColumn` 用来定义一个自增主键；
- `@CreateDateColumn` 定义创建时，自动设置日期；
- `@UpdateDateColumn` 定义更新时，自动设置日期；

对应的数据库结构
```sql
CREATE TABLE `user` (
  `id` bigint NOT NULL,
  `avatarUrl` varchar(100) DEFAULT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(200) NOT NULL,
  `phoneNum` varchar(20) NOT NULL,
  `regtime` datetime NOT NULL,
  `updaterId` bigint NOT NULL,
  `createrId` bigint NOT NULL,
  `createTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updateTime` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `status` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_78a916df40e02a9deb1c4b75ed` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

#### 创建UserService
创建或者修改`src/service/user.service.ts`文件。
```typescript
// src/service/user.service.ts
import { Provide } from '@midwayjs/decorator';
import { User } from '../eneity/user';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Provide()
export class UserService {

  @InjectEntityModel(User)
  userModel: Repository<User>;

  async create(user: User): Promise<User> {
    return this.userModel.save(user);
  }

  async findById(id: number): Promise<User> {
    return this.userModel.findOneBy({ id });
  }

  async delete(id: number): Promise<DeleteResult> {
    return this.userModel.delete(id);
  }

}
```
- `@Provide` 表示这个类将会由系统自动实例化，在使用的时候，只需要使用`@Inject`注入就可以了；
- `@InjectEntityModel` 注入实体模型数据库操作工具；
>注意：由于调整了UserService，`src/controller/api.controller.ts`、`test/controller/api.test.ts`会报错，直接删掉即可

#### 创建UserController
创建或者修改`src/controller/user.controller.ts`文件。
```typescript
// src/controller/user.controller.ts
import { Inject, Controller, Query, Post, Body } from '@midwayjs/decorator';
import { User } from '../eneity/user';
import { UserService } from '../service/user.service';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Controller('/api/user')
export class UserController {
  @Inject()
  userService: UserService;

  @Post('/create', { description: '创建' })
  async create(@Body() user: User): Promise<User> {
    Object.assign(user, {
      id: new Date().getTime(),
      regtime: new Date(),
      updaterId: 1,
      createrId: 1,
    });
    return this.userService.save(user);
  }

  @Post('/findById', { description: '通过主键查找' })
  async findById(@Query('id') id: number): Promise<User> {
    return this.userService.findById(id);
  }

  @Post('/delete', { description: '删除' })
  async delete(@Query('id') id: number): Promise<DeleteResult> {
    return this.userService.delete(id);
  }
}
```

#### 添加单元测试
添加文件`test/controller/user.test.ts`
```typescript
// test/controller/user.test.ts
import {close, createApp, createHttpRequest} from '@midwayjs/mock';
import {Application, Framework} from '@midwayjs/koa';
import {User} from '../../src/eneity/user'

describe('test/controller/user.test.ts', () => {

  let app: Application;
  let o: User;

  beforeAll(async () => {
    try {
      app = await createApp<Framework>();
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
      phoneNum: new Date().getTime().toString(),
    });
    const result = await createHttpRequest(app).post('/api/user/create')
      .send(o);
    expect(result.status).toBe(200);
    // 将创建好的数据存起来，以供后面测试使用（返回的数据会有id）
    o = result.body;
  });

  // findById
  it('should POST /api/user/findById', async () => {
    const result = await createHttpRequest(app).post('/api/user/findById?id=' + o.id);
    expect(result.status).toBe(200);
  });

  // delete
  it('should POST /api/user/delete', async () => {
    const result = await createHttpRequest(app).post('/api/user/delete?id=' + o.id);
    expect(result.status).toBe(200);
  });
});
```
- `beforeAll`、`afterAll` 分别会在测试开始前、后执行；
- `createApp<Framework>()` BeforeAll阶段的error会忽略，需要手动处理异常；

>单元测试的详细文档，见：http://www.midwayjs.org/docs/testing

#### 执行单元测试
```bash
>npm run test
```
>如果测试时间过长，会导致测试失败，那么我们需要修改超时时间

#### 修改测试类的超时时间
- 在根目录中添加文件`jest.setup.js`;
```typescript
// jest.setup.js
// 只需要一行代码
// 设置单元测试超时时间
jest.setTimeout(60000);
```
- 修改`jest`配置文件`jest.config.js`;
```typescript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/test/fixtures'],
  coveragePathIgnorePatterns: ['<rootDir>/test/'],
  // 添加如下一行代码，引入jest初始化文件
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js']
};
```

#### IntelliJ IDEA中Debug
- 运行/调试配置
- 启动Debug

#### 使用Postman测试
- 新增
- 查找
- 删除

## 封装增删改查

### 问题
- 大多数情况，所有实体类都有统一字段，需要抽取实体模型的基类；
- 需要将Service的基本操作封装起来；
- 需要将Controller的基本操作封装起来

### 抽取Entity基类
- 创建目录`common`;
- 创建基类`src/common/BaseEntity.ts`;
```typescript
// src/common/BaseEntity.ts
import { Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryColumn({ type: 'bigint' })
  id: number;

  @Column({ type: 'bigint' })
  updaterId: number;

  @Column({ type: 'bigint' })
  createrId: number;

  @CreateDateColumn()
  createTime: Date;

  @UpdateDateColumn()
  updateTime: Date;
}
```
- 调整实体类`src/entity/user.ts`;

继承`BaseEntity`，并删除`user.ts`中的通用字段。
```typescript
// src/entity/user.ts
import { EntityModel } from '@midwayjs/orm';
import { Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@EntityModel('user')
export class User extends BaseEntity {
  @Column({ length: 100, nullable: true })
  avatarUrl: string;

  @Column({ length: 20, unique: true })
  username: string;

  @Column({ length: 200 })
  password: string;

  @Column({ length: 20 })
  phoneNum: string;

  @Column()
  regtime: Date;

  @Column({ type: 'int', default: 1 })
  status: number;
}
```

### 抽取Service基类
#### 创建基类`src/common/BaseService.ts`;
```typescript
// src/common/BaseService.ts
import { In, Repository } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

export abstract class BaseService<T extends BaseEntity> {

  abstract getModel(): Repository<T>;

  async save(o: T) {
    if (!o.id) o.id = new Date().getTime();
    return this.getModel().save(o);
  }

  async delete(id: number) {
    return this.getModel().delete(id);
  }

  async findById(id: number): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getModel().findOneBy({ id });
  }

  async findByIds(ids: number[]): Promise<T[]> {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getModel().findBy({ id: In(ids) });
  }

  async findOne(where: FindOptionsWhere<T>): Promise<T> {
    return this.getModel().findOne({ where });
  }

}
```
- 基类定义为抽象类`abstract`,并添加抽象接口`abstract getModel()`；
- `<T extends BaseEntity>`泛型用法，定义`T`为`BaseEntity`的子类；

#### 调整`src/service/user.service.ts`;
```typescript
import { Provide } from '@midwayjs/decorator';
import { User } from '../eneity/user';
import { InjectEntityModel } from '@midwayjs/orm';
import { Repository } from 'typeorm';
import { BaseService } from '../common/BaseService';

@Provide()
export class UserService extends BaseService<User> {

  @InjectEntityModel(User)
  model: Repository<User>;

  getModel(): Repository<User> {
    return this.model;
  }

}
```
- 添加继承`UserService extends BaseService<User>`;
- 实现接口`getModel()`，并返回`Repository`;

### 抽取Controller基类
#### 创建基类`src/common/BaseController.ts`;
```typescript
// src/common/BaseController.ts
import { BaseService } from './BaseService';
import { BaseEntity } from './BaseEntity';
import { Body, Post, Query } from '@midwayjs/decorator';

/**
 * Controller基础类，由于类继承不支持装饰类@Post、@Query、@Body等，
 * 所以这里的装饰类不生效，否则实现类就不需要再写多余代码了，
 * 这里保留在这里，以备以后可能会支持继承的装饰类
 */
export abstract class BaseController<T extends BaseEntity> {

  abstract getService(): BaseService<T>;

  @Post('/create')
  async create(@Body() body: T): Promise<T> {
    return this.getService().save(body);
  }

  @Post('/delete')
  async delete(@Query('id') id: number): Promise<boolean> {
    await this.getService().delete(id);
    return true;
  }

  @Post('/update')
  async update(@Body() body: T): Promise<T> {
    return this.getService().save(body);
  }

  @Post('/findById')
  async findById(@Query('id') id: number): Promise<T> {
    return this.getService().findById(id);
  }

  @Post('/findByIds')
  async findByIds(@Query('ids') ids: number[]): Promise<T[]> {
    return this.getService().findByIds(ids);
  }

}
```
- 基类定义为抽象类`abstract`,并添加抽象接口`abstract getService()`；
- `<T extends BaseEntity>`泛型用法，定义`T`为`BaseEntity`的子类；

#### 调整`src/controller/user.controller.ts`;
```typescript
// src/controller/user.controller.ts
import { Inject, Controller, Query, Post, Body } from '@midwayjs/decorator';
import { User } from '../eneity/user';
import { UserService } from '../service/user.service';
import { BaseController } from '../common/BaseController';
import { BaseService } from '../common/BaseService';

@Controller('/api/user')
export class UserController extends BaseController<User> {

  @Inject()
  userService: UserService;

  getService(): BaseService<User> {
    return this.userService;
  }

  @Post('/create', { description: '创建' })
  async create(@Body() user: User): Promise<User> {
    Object.assign(user, {
      id: new Date().getTime(),
      regtime: new Date(),
      updaterId: 1,
      createrId: 1,
    });
    return super.create(user);
  }

  @Post('/findById', { description: '通过主键查找' })
  async findById(@Query('id') id: number): Promise<User> {
    return super.findById(id);
  }

  @Post('/delete', { description: '删除' })
  async delete(@Query('id') id: number): Promise<boolean> {
    return super.delete(id);
  }

}
```
- 添加继承`UserController extends BaseController`；
- 实现抽象接口`getService()`；
- 调用基类方法，使用`super.xxx()`；

### 运行单元测试
```bash
>npm run test

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        10.686 s
```

## 统一返回结果处理

### 中间件
web中间件是在控制器调用`之前`和`之后`调用的函数方法，我们可以利用中间件在接口执行前或者后，加一些逻辑。
比如：统一返回格式、接口鉴权。

### 统一接口状态、异常码
添加`src/common/ErrorCode.ts`。
```typescript
// src/common/ErrorCode.ts
export class ErrorCode {
  /**
   * 100000 正常
   */
  static OK = 100000;
  /**
   * 400000-500000 平台异常
   */
  static SYS_ERROR = 400000;
  /**
   * 50000 未知异常
   */
  static UN_ERROR = 500000;
  /**
   * 60000-69999 基本的业务异常
   */
  static BIZ_ERROR = 600000;
}
```

### 使用中间件统一接口返回数据格式
#### 添加中间件`src/middleware/format.middleware.ts`
```typescript
// src/middleware/format.middleware.ts
import { IMiddleware } from '@midwayjs/core';
import { Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { ErrorCode } from '../common/ErrorCode';

/**
 * 对接口返回的数据统一包装
 */
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      return { code: ErrorCode.OK, msg: 'OK', data: result };
    };
  }

  match(ctx) {
    return ctx.path.indexOf('/api') === 0;
  }

  static getName(): string {
    return 'API_RESPONSE_FORMAT';
  }
}
```
- `match(ctx)`方法确定哪些路径会被拦截；
>详细的中间件使用说明见：http://www.midwayjs.org/docs/middleware

#### 注册中间件
注册中间件，需要修改`src/configuration.ts`。
```typescript
import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/orm';
import { FormatMiddleware } from './middleware/format.middleware';

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {
  @App()
  app: koa.Application;

  async onReady() {
    // 注册中间件 FormatMiddleware
    this.app.useMiddleware([FormatMiddleware, ReportMiddleware]);
  }
}
```

#### Postman查看返回结果
此时返回结果已经被重新包装了。
图3-1

#### 异常处理
统一的异常处理使用异常过滤去，可以在这里进行异常的封装处理。
- 创建或者修改异常过滤器`src/filter/default.filter.ts`;
```typescript
// src/filter/default.filter.ts
import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ErrorCode } from '../common/ErrorCode';

@Catch()
export class DefaultErrorFilter {

  async catch(err: Error, ctx: Context) {
    return { code: ErrorCode.UN_ERROR, msg: err.message };
  }

}
```

- 创建或者修改异常过滤器`src/filter/notfound.filter.ts`;
```typescript
// src/filter/notfound.filter.ts
import { Catch } from '@midwayjs/decorator';
import { httpError, MidwayHttpError } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';

@Catch(httpError.NotFoundError)
export class NotFoundFilter {

  async catch(err: MidwayHttpError, ctx: Context) {
    // 404 错误会到这里
    ctx.redirect('/404.html');
  }

}
```

- 注册异常过滤器；
```typescript
// src/configuration.ts
import { Configuration, App } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import * as orm from '@midwayjs/orm';
import { FormatMiddleware } from './middleware/format.middleware';
import { NotFoundFilter } from './filter/notfound.filter';
import { DefaultErrorFilter } from './filter/default.filter';

@Configuration({
  imports: [
    orm, // 引入orm组件
    koa,
    validate,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class ContainerLifeCycle {

  @App()
  app: koa.Application;

  async onReady() {
    this.app.useMiddleware([FormatMiddleware, ReportMiddleware]);
    // 注册异常过滤器
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }

}
```
- 使用Postman验证（创建用户，输入一个过长的用户名）；
图3-2

#### 单元测试
由于调整了返回值，此时单元测试会报错，我们需要调整下单元。修改`test/controller/user.test.ts`。
```
o = result.body;
# 改为
o = result.body.data;
```
```bash
>npm run test

Test Suites: 2 passed, 2 total
Tests:       4 passed, 4 total
Snapshots:   0 total
Time:        6.525 s, estimated 9 s

```

## 工具类
### 问题&需求
- 数据库主键需要是一个有序的、全局唯一的长整形；
- 用户的密码需要加密存储，能够验证密码；

### 主键生成器
我们使用Snowflake主键生成算法。
其优点是：高性能，低延迟；独立的应用；按时间有序。
缺点是：需要独立的开发和部署。
我们这里把算法迁移到本地，测试开发没有问题，生产使用需要配置数据中心和服务器。
- 创建工具目录`util`;
- 创建工具类`src/utils/Snowflake.ts`;
```typescript
// src/utils/Snowflake.ts
import { Provide } from '@midwayjs/decorator';

/**
 * Snowflake主键生成算法
 * 完整的算法是生成的ID长度为20位
 * 但是由于js最大值9007199254740991，再多就会溢出，再多要特殊处理。
 * 所以这里设置长度为16位id。将数据中心位调小到1位，将服务器位调小到1位，将序列位调小到10位
 * 这意味着最多支持两个数据中心，每个数据中心最多支持两台服务器
 */
@Provide('idGenerate')
export class SnowflakeIdGenerate {
  private twepoch = 0;
  private workerIdBits = 1;
  private dataCenterIdBits = 1;
  private maxWrokerId = -1 ^ (-1 << this.workerIdBits); // 值为：1
  private maxDataCenterId = -1 ^ (-1 << this.dataCenterIdBits); // 值为：1
  private sequenceBits = 10;
  private workerIdShift = this.sequenceBits; // 值为：10
  private dataCenterIdShift = this.sequenceBits + this.workerIdBits; // 值为：11
  // private timestampLeftShift =
  //   this.sequenceBits + this.workerIdBits + this.dataCenterIdBits; // 值为：12
  private sequenceMask = -1 ^ (-1 << this.sequenceBits); // 值为：4095
  private lastTimestamp = -1;
  private workerId = 1; //设置默认值,从环境变量取
  private dataCenterId = 1;
  private sequence = 0;

  constructor(_workerId = 0, _dataCenterId = 0, _sequence = 0) {
    if (this.workerId > this.maxWrokerId || this.workerId < 0) {
      throw new Error('config.worker_id must max than 0 and small than maxWrokerId-[' + this.maxWrokerId + ']');
    }
    if (this.dataCenterId > this.maxDataCenterId || this.dataCenterId < 0) {
      throw new Error(
        'config.data_center_id must max than 0 and small than maxDataCenterId-[' + this.maxDataCenterId + ']',
      );
    }
    this.workerId = _workerId;
    this.dataCenterId = _dataCenterId;
    this.sequence = _sequence;
  }

  private timeGen = (): number => {
    return Date.now();
  };

  private tilNextMillis = (lastTimestamp): number => {
    let timestamp = this.timeGen();
    while (timestamp <= lastTimestamp) {
      timestamp = this.timeGen();
    }
    return timestamp;
  };

  private nextId = (): number => {
    let timestamp: number = this.timeGen();
    if (timestamp < this.lastTimestamp) {
      throw new Error('Clock moved backwards. Refusing to generate id for ' + (this.lastTimestamp - timestamp));
    }
    if (this.lastTimestamp === timestamp) {
      this.sequence = (this.sequence + 1) & this.sequenceMask;
      if (this.sequence === 0) {
        timestamp = this.tilNextMillis(this.lastTimestamp);
      }
    } else {
      this.sequence = 0;
    }
    this.lastTimestamp = timestamp;
    // js 最大值 9007199254740991，再多就会溢出
    // 超过 32 位长度，做位运算会溢出，变成负数，所以这里直接做乘法，乘法会扩大存储
    const timestampPos = (timestamp - this.twepoch) * 4096;
    const dataCenterPos = this.dataCenterId << this.dataCenterIdShift;
    const workerPos = this.workerId << this.workerIdShift;
    return timestampPos + dataCenterPos + workerPos + this.sequence;
  };

  generate = (): number => {
    return this.nextId();
  };
}
```

### 密码工具
#### 安装组件
```bash
>npm i bcryptjs --save
```

## 接口安全认证
### jwt
### Bearer
### 参数验证组件
### 接口访问状态

## Swagger集成

## 环境变量

## 部署
### 使用Docker部署
### 使用阿里云函数服务部署
### 使用腾讯云函数服务部署













