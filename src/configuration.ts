import { Configuration, App, Inject } from '@midwayjs/decorator';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as orm from '@midwayjs/typeorm';
import { join } from 'path';
import { DefaultErrorFilter } from './filter/default.filter';
import { NotFoundFilter } from './filter/notfound.filter';
import { ReportMiddleware } from './middleware/report.middleware';
import { FormatMiddleware } from './middleware/format.middleware';
import * as redis from '@midwayjs/redis';
import * as swagger from '@midwayjs/swagger';
import * as jwt from '@midwayjs/jwt';
import * as crossDomain from '@midwayjs/cross-domain';
import { SecurityMiddleware } from './middleware/security.middleware';
import * as dotenv from 'dotenv';
import { ILogger } from '@midwayjs/core';

// 初始化环境变量
dotenv.config();

@Configuration({
  imports: [
    crossDomain,  // 支持跨域
    jwt,          // 用于访问凭证签发时进行JWT编码
    swagger,      // API接口工具
    redis,        // 缓存
    orm,          // 数据库操作
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

  @Inject()
  logger: ILogger;

  async onReady() {
    this.app.useMiddleware([SecurityMiddleware, FormatMiddleware, ReportMiddleware]);
    this.app.useFilter([NotFoundFilter, DefaultErrorFilter]);
  }
}
