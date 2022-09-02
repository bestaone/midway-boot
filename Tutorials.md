
## 一、课程简介
midway是阿里巴巴开源的，基于TypeScript语言开发的Nodejs后端框架。
本教程指导大家从0开始搭建一个midway项目。

#### 其遵循两种编程范式
- 面向对象（OOP + Class + IoC）；
- 函数式（FP + Function + Hooks）；

#### 谁较容易上手学习
- 懂Nodejs技术的前端开发；
- 会TypeScript的后端开发；

#### 在这里你可以掌握度如下知识

- 面向对象的开发体验；
- 增删改查及基类封装；
- 数据库操作；
- 缓存操作；
- 用户安全认证及访问安全控制；
- JWT访问凭证；
- 分布式访问状态管理；
- 密码加解密；
- 统一返回结果封装；
- 统一异常管理；
- Snowflake主键生成；
- Swagger集成及支持访问认证；
- 环境变量的使用；
- Docker镜像构建；
- Serverless发布；

#### 本项目源码
https://github.com/bestaone/midway-boot

#### LIVE DEMO
http://midway-boot.hiauth.cn/swagger-ui/index.html

## 二、环境准备

- Nodejs 12+
- Npm 8+
- MySql 5+
- Redis

### 开发工具
我们这里使用 IntelliJ IDEA
>下载地址：https://www.jetbrains.com/zh-cn/idea/download

### 安装数据库

### 安装Redis

## 三、第一个midway项目
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
为了保证代码分隔统一，我们调整下ESLint配置
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
>在windows中代码的首行、尾行不能有空行，否则ESLint提示格式错误，可能是bug。

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

## 四、增删改查
### ORM组件：TypeORM
TypeORM是Object Relation Mapping工具，提供的数据库操作能力。
#### 安装依赖
```bash
>npm i @midwayjs/typeorm@3 typeorm --save
```
安装完后`package.json`文件中会多出如下配置
```json
{
  "dependencies": {
    "@midwayjs/typeorm": "^3.4.4",
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
import * as orm from '@midwayjs/typeorm';

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
  typeorm: {
    dataSource: {
      default: {
        type: 'mysql',
        host: '127.0.0.1',      // 改成你的mysql数据库IP
        port: 3306,             // 改成你的mysql数据库端口
        username: 'root',       // 改成你的mysql数据库用户名（需要有创建表结构权限）
        password: '123456',     // 改成你的mysql数据库密码
        database: 'midway_boot',// 改成你的mysql数据库IP
        synchronize: true,      // 如果第一次使用，不存在表，有同步的需求可以写 true
        logging: true,
        entities: [User],
      }
    }
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
> orm的详细文档见：http://www.midwayjs.org/docs/extensions/orm

### Entity、Service、Controller
#### 创建Entity实体类
- 创建目录`src/entity`;
- 在该目录下创建实体类`user.ts`;
```typescript
// src/entity/user.ts
import { Entity } from '@midwayjs/typeorm';
import {
  Column,
  CreateDateColumn,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
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
import { InjectEntityModel } from '@midwayjs/typeorm';
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
- `@Inject()`装饰类指定该对象会被自动注入；

### 单元测试
#### 添加单元测试类
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

### 开发调试

#### IntelliJ IDEA中Debug
- 运行/调试配置
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/1-1.png">
  </div>
- 启动Debug
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/1-2.png">
  </div>

#### 使用Postman测试
- 新增
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/2-1.png">
  </div>
- 查找
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/2-2.png">
  </div>
- 删除
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/2-3.png">
  </div>

## 五、封装增删改查
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
import { Entity } from '@midwayjs/typeorm';
import { Column } from 'typeorm';
import { BaseEntity } from '../common/BaseEntity';

@Entity('user')
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
import { InjectEntityModel } from '@midwayjs/typeorm';
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

## 六、统一返回结果处理

### 中间件
web中间件是在控制器调用`之前`和`之后`调用的函数方法，我们可以利用中间件在接口执行前或者后，加一些逻辑。
比如：统一返回格式、接口鉴权。

### 统一接口状态、异常码
- 添加`src/common/ErrorCode.ts`;
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
- 添加通用异常类`src/common/CommonException.ts`;
```typescript
// src/common/CommonException.ts
import { MidwayError } from '@midwayjs/core';

export class CommonException extends MidwayError {
  code: number;
  msg: string;
  data: any;
  constructor(code: number, msg: string) {
    super(msg, code.toString());
    this.code = code;
    this.msg = msg;
  }
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
- `@Middleware()`标识此类是一个中间件；
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
import * as orm from '@midwayjs/typeorm';
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
<div align="center">
  <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/3-1.png">
</div>

#### 异常处理
统一的异常处理使用异常过滤器，可以在这里进行异常的封装处理。
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
import * as orm from '@midwayjs/typeorm';
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
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/3-2.png">
  </div>

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

## 七、工具类
### 问题&需求
- 数据库主键需要是一个有序的、全局唯一的长整形；
- 用户的密码需要加密存储，能够验证密码；
- 业务异常需要需要返回给前端，这里使用`断言工具`；

### 主键生成器
我们使用Snowflake主键生成算法。
其优点是：高性能，低延迟；独立的应用；按时间有序。
缺点是：需要独立的开发和部署。
我们这里把算法迁移到本地，测试开发没有问题，生产使用需要配置数据中心和服务器。
- 创建工具目录`utils`;
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

#### 添加工具类`src/utils/PasswordEncoder.ts`
```typescript
// src/utils/PasswordEncoder.ts
const bcrypt = require('bcryptjs');

/**
 * 加密。加上前缀{bcrypt}，为了兼容多种加密算法，这里暂时只实现bcrypt算法
 */
export function encrypt(password) {
  const salt = bcrypt.genSaltSync(5);
  const hash = bcrypt.hashSync(password, salt, 64);
  return '{bcrypt}' + hash;
}

/**
 * 解密
 */
export function decrypt(password, hash) {
  if (hash.indexOf('{bcrypt}') === 0) {
    hash = hash.slice(8);
  }
  return bcrypt.compareSync(password, hash);
}
```

### 断言工具
```typescript
// src/common/Assert.ts
import { CommonException } from './CommonException';

export class Assert {
  /**
   * 不为空断言
   */
  static notNull(obj: any, errorCode: number, errorMsg: string) {
    if (!obj) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 空字符串断言
   */
  static notEmpty(obj: any, errorCode: number, errorMsg: string) {
    if (!obj || '' === obj.trim()) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 布尔断言
   */
  static isTrue(expression: boolean, errorCode: number, errorMsg: string) {
    if (!expression) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

}
```

## 八、接口安全认证
很多时候，后端接口需要登录后才能进行访问，甚至有的接口需要拥有相应的权限才能访问。
这里实现`bearer`验证方式（bearerFormat 为 JWT）。

### 安装JWT组件
```base
>npm i @midwayjs/jwt@3 --save
>npm i @types/jsonwebtoken --save-dev
```
安装完后`package.json`文件中会多出如下配置
```json
{
  "dependencies": {
    "@midwayjs/jwt": "^3.3.11"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^8.5.8"
  }
}
```
### 添加JWT配置
- 修改`src/config/config.default.ts`，添加如下内容；
```bash
// src/config/config.default.ts
jwt: {
  secret: 'setscrew',
  expiresIn: 60 * 60 * 24,
}
```
- 注册`JWT`组件；
```typescript
// src/configuration.ts
import * as jwt from '@midwayjs/jwt';

@Configuration({
  imports: [
    jwt,
    //...
  ],
})
export class ContainerLifeCycle {
    //...
}
```
> 关于JWT的详细使用文档，见：http://www.midwayjs.org/docs/extensions/jwt

### 安装Redis组件
```base
>npm i @midwayjs/redis@3 --save
>npm i @types/ioredis --save-dev
```
安装完后`package.json`文件中会多出如下配置
```json
{
  "dependencies": {
    "@midwayjs/redis": "^3.0.0"
  },
  "devDependencies": {
    "@types/ioredis": "^4.28.7"
  }
}
```

### 注册Redis组件
```typescript
// src/configuration.ts
import * as redis from '@midwayjs/redis';

@Configuration({
  imports: [
    redis,
    // ...
  ],
})
export class ContainerLifeCycle {
    // ...
}
```

### 添加配置
修改`src/config/config.default.ts`，添加如下内容：
#### 添加Redis配置
```bash
// src/config/config.default.ts
redis: {
  client: {
    host: 127.0.0.1,
    port: 6379,
    db: 0,
  },
}
```
> 关于Redis的详细使用文档，见：http://www.midwayjs.org/docs/extensions/redis

#### 添加安全拦截配置
```bash
// src/config/config.default.ts
app: {
  security: {
    prefix: '/api',         # 指定已/api开头的接口地址需要拦截
    ignore: ['/api/login'], # 指定该接口地址，不需要拦截
  },
}
```

### 添加接口安全拦截中间件

#### 添加常量定义
```typescript
// src/common/Constant.ts
export class Constant {
  // 登陆验证时，缓存用户登陆状态KEY的前缀
  static TOKEM = 'TOKEN';
}
```

#### 添加用户访问上下文类
```typescript
// src/common/UserContext.ts
/**
 * 登陆后存储访问上下文的状态数据，同时也会存在redis缓存中
 */
export class UserContext {
  userId: number;
  username: string;
  phoneNum: string;
  constructor(userId: number, username: string, phoneNum: string) {
    this.userId = userId;
    this.username = username;
    this.phoneNum = phoneNum;
  }
}
```

#### 新增或者编辑`src/interface.ts`，将`UserContext`注册到`ApplecationContext`中
```typescript
// src/interface.ts
import '@midwayjs/core';
import { UserContext } from './common/UserContext';

declare module '@midwayjs/core' {
  interface Context {
    userContext: UserContext;
  }
}
```

#### 新增中间件`src/middleware/security.middleware.ts`
```typescript
// src/middleware/security.middleware.ts
import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { UserContext } from '../common/UserContext';
import { RedisService } from '@midwayjs/redis';
import { Constant } from '../common/Constant';

/**
 * 安全验证
 */
@Middleware()
export class SecurityMiddleware {

  @Inject()
  jwtUtil: JwtService;

  @Inject()
  cacheUtil: RedisService;

  @Config('app.security')
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      if (!ctx.headers['authorization']) {
        throw new httpError.UnauthorizedError('缺少凭证');
      }
      const parts = ctx.get('authorization').trim().split(' ');
      if (parts.length !== 2) {
        throw new httpError.UnauthorizedError('无效的凭证');
      }
      const [scheme, token] = parts;
      if (!/^Bearer$/i.test(scheme)) {
        throw new httpError.UnauthorizedError('缺少Bearer');
      }
      // 验证token，过期会抛出异常
      const jwt = await this.jwtUtil.verify(token, { complete: true });
      // jwt中存储的user信息
      const payload = jwt['payload'];
      const key = Constant.TOKEM + ':' + payload.userId + ':' + token;
      const ucStr = await this.cacheUtil.get(key);
      // 服务器端缓存中存储的user信息
      const uc: UserContext = JSON.parse(ucStr);
      if (payload.username !== uc.username) {
        throw new httpError.UnauthorizedError('无效的凭证');
      }
      // 存储到访问上下文中
      ctx.userContext = uc;
      return next();
    };
  }

  public match(ctx: Context): boolean {
    const { path } = ctx;
    const { prefix, ignore } = this.securityConfig;
    const exist = ignore.find((item) => {
      return item.match(path);
    });
    return path.indexOf(prefix) === 0 && !exist;
  }

  public static getName(): string {
    return 'SECURITY';
  }

}
```
- `@Config('app.security')`装饰类，指定加载配置文件`src/config/config.**.ts`中对应的配置信息；
- 使用`JwtService`进行JWT编码校验；
> `jwt token`将用户信息编码在token中，解码后可以获取对应用户数据，通常情况下，不需要存储到redis中；
> 但是有个缺点就是，不能人为控制分发出去的token失效。所以，有时人们会使用缓存中的用户信息；
> 这里使用了JWT+Redis的方式，是为了演示两种做法；

#### 注册中间件
```typescript
// src/configuration.ts
this.app.useMiddleware([SecurityMiddleware, FormatMiddleware, ReportMiddleware]);
```

#### 添加登陆接口
- 添加DTO;
```typescript
// src/api/dto/CommonDTO.ts
export class LoginDTO {
  username: string;
  password: string;
}
```
- 添加VO;
```typescript
// src/api/vo/CommonVO.ts
export class LoginVO {
  accessToken: string;
  expiresIn: number;
}
```

- 修改`src/service/user.service.ts`，添加通过用户名查找用户接口；
```typescript
import { Provide } from '@midwayjs/decorator';
import { User } from '../eneity/user';
import { InjectEntityModel } from '@midwayjs/typeorm';
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
```

- 添加Controller`src/controller/common.controller.ts`；
```typescript
// src/controller/common.controller.ts
import { Body, Config, Controller, Inject, Post } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { UserService } from '../service/user.service';
import { RedisService } from '@midwayjs/redis';
import { LoginDTO } from '../api/dto/CommonDTO';
import { LoginVO } from '../api/vo/CommonVO';
import { SnowflakeIdGenerate } from '../utils/Snowflake';
import { JwtService } from '@midwayjs/jwt';
import { Assert } from '../common/Assert';
import { ErrorCode } from '../common/ErrorCode';
import { UserContext } from '../common/UserContext';
import { Constant } from '../common/Constant';
import { ILogger } from '@midwayjs/core';
import { decrypt } from '../utils/PasswordEncoder';
import { Validate } from '@midwayjs/validate';
import { ApiResponse, ApiTags } from '@midwayjs/swagger';

@ApiTags(['common'])
@Controller('/api')
export class CommonController {

  @Inject()
  logger: ILogger;

  @Inject()
  ctx: Context;

  @Inject()
  userService: UserService;

  @Inject()
  cacheUtil: RedisService;

  @Inject()
  jwtUtil: JwtService;

  @Inject()
  idGenerate: SnowflakeIdGenerate;

  @Config('jwt')
  jwtConfig;

  @ApiResponse({ type: LoginVO })
  @Validate()
  @Post('/login', { description: '登陆' })
  async login(@Body() body: LoginDTO): Promise<LoginVO> {
    const user = await this.userService.findByUsername(body.username);
    Assert.notNull(user, ErrorCode.UN_ERROR, '用户名或者密码错误');
    const flag = decrypt(body.password, user.password);
    Assert.isTrue(flag, ErrorCode.UN_ERROR, '用户名或者密码错误');
    const uc: UserContext = new UserContext(user.id, user.username, user.phoneNum);
    const at = await this.jwtUtil.sign({ ...uc });
    const key = Constant.TOKEM + ':' + user.id + ':' + at;
    const expiresIn = this.jwtConfig.expiresIn;
    this.cacheUtil.set(key, JSON.stringify(uc), 'EX', expiresIn);
    const vo = new LoginVO();
    vo.accessToken = at;
    vo.expiresIn = expiresIn;
    return vo;
  }

}
```

#### 使用Postman验证
- 调用接口（未设置凭证）；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/4-1.png">
  </div>
- 使用登陆接口获取token；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/4-2.png">
  </div>
- 调用接口（使用凭证）；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/4-3.png">
  </div>

## 九、Swagger集成
Swagger是一个集成在系统内部，能够通过装饰类描述接口文档的工具，可以方便的测试接口

### 安装组件
```bash
>npm install @midwayjs/swagger@3 --save
>npm install swagger-ui-dist --save
```

### 注册组件
```typescript
// src/configuration.ts
import * as swagger from '@midwayjs/swagger';

@Configuration({
  imports: [
    swagger,
    // ...
  ],
})
export class ContainerLifeCycle {
    // ...
}
```

### 验证
#### Swagger UI 页面
访问：http://127.0.0.1:7001/swagger-ui/index.html
<div align="center">
  <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-1.png">
</div>

#### 测试接口
验证接口，提示`缺少凭证`，需要Swagger支持`bearer`验证
<div align="center">
  <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-2.png">
</div>

#### 添加`bearer`支持
- Swagger支持bearer验证，添加配置；
```
// src/config/config.default.ts
swagger: {
  auth: {
    authType: 'bearer',
  },
},
```
- 在对应Controller中添加注解`@ApiBearerAuth()`；
```
// src/controller/user.controller.ts
@ApiBearerAuth()
@Controller('/api/user')
export class UserController extends BaseController<User> {
  // ...
}
```
- 再访问Swagger，就出现了Authorize按钮；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-3.png">
  </div>
- 使用登陆接口，获取accessToken，进行认证，便可以访问相关接口了；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-4.png">
  </div>
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-5.png">
  </div>
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-6.png">
  </div>

### Swagger常用装饰类
- `@ApiTags()`通常用于`Controller`，将其分类标记；
- `@ApiResponse()`用于标注API的返回值；
- `@ApiProperty()`用于标注返回DTO、VO，实体类的属性；

### 调整相关代码
`common.controller.ts`、`user.controller.ts`、`user.ts`、`CommonDTO.ts`、`CommonVO.ts`、`BaseEntity.ts`；
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-7.png">
  </div>
  <div align="center">
    <img width="800" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/tutorials/5-8.png">
  </div>

> 关于Swagger的详细使用文档，见：http://www.midwayjs.org/docs/extensions/swagger

### 使用Swagger Knife4j2

- 安装
```bash
>npm install midwayjs-kinfe4j2 --save
```

- 依赖
```
@midwayjs/swagger": "^3.3.14
midwayjs-kinfe4j2": "^0.0.2
```

- 修改导入
```
import ??? from '@midwayjs/swagger';
改为
import ??? from 'midwayjs-knife4j2';
```

## 十、环境变量
通常我们不希望将生产环境的相关配置写在项目代码中，而希望在不同的环境中启动时自动读取环境中设置的配置；
在本教程中，我也不希望将自己的数据库、缓存IP提交到代码仓库，所以可以使用环境变量+host；

### 安装组件
```bash
npm install dotenv --save
```

### 初始化环境变量
```typescript
// src/configuration.ts
import * as dotenv from 'dotenv';

// 初始化环境变量
dotenv.config();

@Configuration({
  imports: [
      // ...
  ]
})
export class ContainerLifeCycle {
    // ...
}
```

### 在根目录添加文件.env
```
// .env
MYSQL_HOST=devserver
MYSQL_USERNAME=dev
MYSQL_PASSWORD=123456
MYSQL_PORT=3306
REDIS_HOST=devserver
REDIS_PORT=6379
```
### 在host文件中添加域名映射
```
// windows电脑
// C:\Windows\System32\drivers\etc\hosts
// xx.xx.xx.xx 为你自己mysql、redis的ip，如果在一台机器上的话
xx.xx.xx.xx devserver
```

### 使用环境变量
```
// src/config/config.default.ts
typeorm: {
  dataSource: {
    default: {
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: process.env.MYSQL_PORT,
      username: process.env.MYSQL_USERNAME,
      password: process.env.MYSQL_PASSWORD,
      database: 'midway_boot',
      synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
      logging: true,
      entities: [User],
    }
  }
},
// redis配置
redis: {
  client: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    db: 0,
  },
},
```
> 在生产环境中使用，你可以将环境变量配置到系统中，如果你是Docker启动，可以指定环境变量文件。

## 十一、部署
### 构建Docker镜像

#### 什么shiDocker
Docker是基于Go语言进行开发实现，一个开源的应用容器引擎。

#### 为什么要用Docker
- 可以使用镜像快速构建一套标准的开发环境，快速部署代码；
- 高效的资源利用，可以实现更高的性能，同时对资源的额外需求很低；
- 兼容性高，让用户可以在不同平台间轻松的迁移应用；
- 可以实现自动化且高效的容器管理。

#### 如何构建Docker
在项目根目录中添加Dockerfile构建配置文件；
```bash
FROM node:16.14.2-alpine
WORKDIR /app
ENV TZ="Asia/Shanghai"

COPY . .

RUN npm install --registry=https://registry.npm.taobao.org
RUN npm run build
# 移除开发环境的依赖
RUN npm prune --production

# 暴露端口（内部）
EXPOSE 7001

# 设定容器启动时第一个运行的命令及其参数
ENTRYPOINT ["npm", "run", "start"]
```

### 使用Jenkins CI/CD
Jenkins是一个基于java开发的一个开呀的自动化工具，它能够帮我们快速的完成测试、编译、构建、打包、发布等一系列部署任务；

#### 安装配置Jenkins
可以网上查找下安装配置方法，这里不赘述了。

#### 编写部署脚本 /opt/services/deploy.sh
```bash
#!/bin/sh

#./deploy.sh -n hi-mall -v 1.0 -R hiauth -p 8182:8182

url='bestaone'

name=""
version="1.0"
registry="hlll"
portMapping=""
opts=""
envFile=""

function useage () {
     echo "Usage: -n name -v version -p portMapping [-R registry] [-e envFile] [-o opts]"
     echo "-n name, app name"
     echo "-v version, deploy image version"
     echo "-p portMapping, container port mapping"
     echo "-R registry, image registry"
     echo "-e envFile, Env File"
     echo "-o opts, JVM OPST"
     exit 1
}

while getopts "h:n:v:R:V:p:N:e:o:P:" option
do
    case "${option}" in
        n)
            name=${OPTARG} ;;
        v)
            version=${OPTARG} ;;
                p)
            portMapping+=" -p "${OPTARG} ;;
        R)
            registry=${OPTARG} ;;
                e)
            envFile=${OPTARG} ;;
        o)
            opts=${OPTARG} ;;
        \?)
            useage ;;
    esac
done

if [ "${name}" == "" ] ; then
        useage ;
fi

if [ "${portMapping}" == "" ] ; then
        useage ;
fi

echo "--------------------------------------------------------------------------"

echo "Name              = ${name}"
echo "Version           = ${version}"
echo "Opts              = ${opts}"
echo "Registry          = ${registry}"
echo "PortMapping       = ${portMapping}"
echo "EnvFile           = ${envFile}"

runcommand=""

echo "Deploy ${name}:${version}"

echo "step 1 : shoutdown and remove container"
docker ps -a --filter "name=$name" | awk '{print $1}'| while read cid
do
        if [ $cid != 'CONTAINER' ];then
                echo docker rm -f $cid
                docker rm -f $cid
        fi
done

echo "step 2 : remove image"
echo docker rmi $url/$registry/$name:$version
docker rmi $url/$registry/$name:$version

echo "step 3 : build new image"
echo docker build -t $url/$registry/$name:$version /opt/services/$name
docker build -t $url/$registry/$name:$version /opt/services/$name

echo "step 4 : run container"

if [ "${name}" != "" ] ; then
        runcommand="${runcommand} --name ${name} "
fi

if [ "${portMapping}" != "" ] ; then
        runcommand="${runcommand} ${portMapping} "
fi

if [ "${volume}" != "" ] ; then
        runcommand="${runcommand} -v ${volume} "
fi

if [ "${envFile}" != "" ] ; then
        runcommand="${runcommand} --env-file ${envFile} "
fi

if [ "${opts}" != "" ] ; then
        runcommand="${runcommand} -e 'JAVA_OPTS=${opts}' "
fi

echo docker run -d $runcommand $url/$registry/$name:$version
docker run -d $runcommand $url/$registry/$name:$version

echo "step 5 : check deploy"
echo docker images
docker images
echo docker ps -a
docker ps -a

echo "${name}:${version} deploy over!"
```

#### 创建Jenkins任务
添加一个自由风格的任务，添加好源码地址（git），然后添加执行shell。
```bash
# 切换目录
cd /root/.jenkins/workspace/midway-boot
# 删除旧文件
rm -rf /opt/services/midway-boot/*
# 复制新文件
cp -rf /root/.jenkins/workspace/midway-boot/* 	/opt/services/midway-boot/

# 发布
/opt/services/deploy.sh -n midway-boot -R midway -p 10100:7001 -e /opt/services/.env
```
> 在这之前需要先创建目录 /opt/services/midway-boot，以及添加环境变量配置文件 /opt/services/.env

#### 测试
等Jenkins构建任务之心完成之后，我们可以输入主机地址（域名或IP）进行访问了

### 部署到阿里云云函数Serverless服务

#### 添加函数定义文件 f.yml
```yaml
service:
  name: midway_boot

provider:
  name: aliyun              # aliyun(cn-zhangjiakou)、tencent(ap-shanghai)
  region: cn-zhangjiakou
  runtime: nodejs14
  memorySize: 128
  timeout: 5
  environment:
    MYSQL_HOST: devserver   # 需要修改
    MYSQL_USERNAME: root
    MYSQL_PASSWORD: 123456
    MYSQL_PORT: 3306
    REDIS_HOST: devserver
    REDIS_PORT: 6379

deployType:
  type: koa
  version: 3.0.0

custom:
  customDomain:
    domainName: auto        # auto:需要使用自动域名

functions:
  apis:
    handler: index.handler
    events:
      - http:
          path: /*

```

#### 添加启动文件 app.js
在项目根目录下添加启动文件app.js
```typescript
const WebFramework = require('@midwayjs/koa').Framework;
const { Bootstrap } = require('@midwayjs/bootstrap');

/**
 * serverless 部署是需要 添加此启动文件
 */
module.exports = async () => {
  console.log('启动服务');
  // 加载框架并执行
  await Bootstrap.run();
  // 获取依赖注入容器
  const container = Bootstrap.getApplicationContext();
  // 获取 koa framework
  const framework = container.get(WebFramework);
  // 返回 app 对象
  return framework.getApplication();
};

```

#### 发布
```bash
npm run deploy
```

控制台输出：
```bash
Install production dependencies...
 - Dependencies install complete
Package artifact...
 - Artifact file serverless.zip
There is auto config in the service: midway_boot

Auto Domain: http://app-index.midway-boot.1480563473081285.cn-zhangjiakou.fc.devsapp.net/

Function 'app_index' deploy success
```
> http://app-index.midway-boot.1480563473081285.cn-zhangjiakou.fc.devsapp.net 就是对应的服务地址

> 时间较长，观察命令行输出，耐心等待会。

#### 配置
第一次执行需要配置云平台账号，如果没有出现配置提示，可以主动执行：
```bash
npx midway-bin deploy --resetConfig
```
> 如何配置，请参考：[点击这里](https://github.com/bestaone/midway-boot/edit/main/Tutorials.md)

#### 验证
访问：https://app-index.midway-boot.1480563473081285.cn-zhangjiakou.fc.devsapp.net/swagger-ui/index.html

#### 绑定域名
- 注册一个自己的域名；
- 配置一个CNAME类型域名，绑定到阿里云自动分配的域名；
- 到阿里云的“函数计算 FC”-“域名管理”页面中配置，按提示配置；

### 部署到腾讯云云函数Serverless服务

#### 修改配置 f.yml
```bash
provider:
  name: aliyun
  region: cn-zhangjiakou

# 改为

provider:
  name: tencent
  region: ap-shanghai
```

#### 发布
```bash
npm run deploy
```

#### 授权
控制台会输出二维码，使用微信扫码授权。

#### 测试
使用控制台输入的域名进行测试。

