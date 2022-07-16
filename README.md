
<h1 align="center">midway-boot</h1>
<div align="center">

midway-boot是基于阿里巴巴后端框架Midway构建的一套快速启动的Nodejs服务端项目模板，这里提供了常用功能的最佳实践，帮助你快速启动一个基于Nodejs的服务端项目。

[![Star](https://img.shields.io/github/stars/bestaone/midway-boot?color=42b883&logo=github&style=flat-square)](https://github.com/bestaone/midway-boot/stargazers)
[![Fork](https://img.shields.io/github/forks/bestaone/midway-boot?color=42b883&logo=github&style=flat-square)](https://github.com/bestaone/midway-boot/network/members)
[![Language](https://img.shields.io/badge/%E8%AF%AD%E8%A8%80-TypeScript%20%7C%20Nodejs-red?style=flat-square&color=42b883)](https://github.com/bestaone/midway-boot)
[![License](https://img.shields.io/github/license/bestaone/midway-boot?color=42b883&style=flat-square)](https://github.com/bestaone/midway-boot/blob/main/LICENSE)
[![Author](https://img.shields.io/badge/作者-Earven-orange.svg)](https://github.com/bestaone)

</div>


### 技术栈
- TypeScript
- Nodejs
- Midway
- Mysql
- Redis

### 特性&功能
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

### 目录结构
```
├─doc                     # 相关文档
├─src                     # 源码目录
│  ├─api                  # api接口定义及输入输出定义
│  ├─common               # 通用类
│  ├─config               # 配置
│  ├─controller           # 控制器
│  ├─entity               # 数据对象模型
│  ├─filter               # 过滤器
│  ├─middleware           # 中间件
│  ├─service              # 服务类
│  ├─utils                # 工具类
│  ├─configurations.ts    # 服务生命周期管理及配置
│  └─interface.ts         # 接口定义
├─test                    # 测试类目录
├─.env                    # 环境变量
├─app.js                  # 支持发布Serverless
├─bootstrap.js            # 启动入口
├─Dockerfile              # Docker构建文件
├─f.yml                   # Serverless标准化spec配置文件
```

### LIVE DEMO
- http://midway-boot.hiauth.cn/swagger-ui/index.html
> API接口需要认证，先使用login接口获取accessToken（账号：zhangsan/123456），然后复制，点击Swagger页面中的Authorize按钮，输入这个accessToken,就可以测试其他接口了。

- 登陆接口
<p align="center">
  <img width="900" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/img/1-1.png">
</p>

- 设置访问凭证
<p align="center">
  <img width="900" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/img/1-2.png">
</p>

- 验证接口
<p align="center">
  <img width="900" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/img/1-3.png">
</p>

## 快速启动

### 环境要求
- NodeJS v12+
- Npm 8+
- MySQL5+
- Redis

### 下载源码
```bash
>git clone https://github.com/bestaone/midway-boot.git
```

### 调整配置

#### 创建数据库schema
在mysql中创建名称为 midway-boot 的 schema

#### 调整配置文件 .env 内容
```bash
MYSQL_HOST=devserver    # 你的mysql数据库IP 或者 域名
MYSQL_USERNAME=dev      # 你的mysql数据库用户名（需要有建表权限）
MYSQL_PASSWORD=123456   # 你的mysql数据库密码
MYSQL_PORT=3306         # 你的mysql数据库端口
REDIS_HOST=devserver    # 你的redis IP 或者 域名
REDIS_PORT=6379         # 你的redis端口
```
> src/config/config.default.ts -> orm.synchronize=true，可控制程序启动时自动创建、更新表结构，但是需要先把数据库schema建好

#### 构建、启动
```bash
# 按顺序执行
>cd midway-boot
>npm install       # 安装依赖
>npm run test      # 运行单元测试，这过程会检查mysql、redis是否配置正确
>npm run dev       # 启动服务
```
> 程序启动时会自动生成表结构，不需要手动创建表结构（但是需要先把数据库schema建好）
> 如果测试通不过，检查下数据库有没有自动生成测试账号（user.test.ts中会创建测试账号）

#### 测试、验证
- 访问Swagger：http://127.0.0.1:7001/swagger-ui/index.html

## 开发调试
以IntelliJ IDEA为例：
- 导入项目代码；
- 终端中运行 “npm install” 安装依赖；
- 运行/调试配置；
<p align="center">
  <img width="900" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/img/2-1.png">
</p>

## 部署

### Docker
```bash
>cd midway-boot
>docker build -t midway-boot:v1.0 .
>docker run -d --name midway-boot -p 17001:7001 --env-file /opt/.env midway-boot:v1.0
```

### Serverless

- 开通阿里云函数服务并设置，参考：
http://www.midwayjs.org/docs/serverless/serverless_dev

- 调整配置（f.yml）
```
# domainName 改为 auto，也可以使用自己配置的域名
custom:
  customDomain:
    domainName: auto
```

- 发布
```bash
# 首次发布，需要使用 npx midway-bin deploy --resetConfig 命令配置客户端
# 发布到 阿里云 Serverless， 时间较长，需要等待，大概5分钟
> npm run deploy
```

- 测试

使用阿里云自动分配的域名访问Swagger进行验证

## 授权协议
本项目执行 [MIT](https://github.com/bestaone/midway-boot/blob/main/LICENSE) 协议

## 社区与作者
<p align="center">
  <img width="900" src="https://earven.oss-cn-shanghai.aliyuncs.com/midway-boot/img/community_wechat.jpg">
</p>


>如果群二维码失效了，请先添加我的微信，然后我拉你入群。

