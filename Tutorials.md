
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
    return this.userService.create(user);
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
      id: new Date().getTime(),
      username: new Date().getTime().toString(),
      password: new Date().getTime().toString(),
      phoneNum: new Date().getTime().toString(),
      regtime: new Date(),
      updaterId: 1,
      createrId:1
    });
    const result = await createHttpRequest(app).post('/api/user/create')
      .send(o);
    expect(result.status).toBe(200);
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

### 调整Entity、Service、Controller
### 泛型介绍
### 改造单元测试

## 统一返回结果处理
### 中间件
### 接口数据包装
### 异常过滤器
### 异常处理

## 工具类
### 主键生成器
### 密码工具

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













