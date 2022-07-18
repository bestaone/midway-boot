import { MidwayConfig } from '@midwayjs/core';

export default {
  // use for cookie sign key, should change to your own and keep security
  keys: '1656642815846_4983',
  app: {
    security: {
      prefix: '/api',
      ignore: ['/api/login'],
    },
  },
  koa: {
    port: 7001,
  },
  // ORM和数据库配置
  orm: {
    type: 'mysql',
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: 'midway_boot',
    synchronize: true, // 如果第一次使用，不存在表，有同步的需求可以写 true
    logging: true,
  },
  // redis配置
  redis: {
    client: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      db: 0,
    },
  },
  // jwt配置
  jwt: {
    secret: 'setscrew',
    expiresIn: 60 * 60 * 24,
  },
  // swagger配置
  swagger: {
    title: 'midway-boot',
    description: 'Midway脚手架',
    auth: {
      authType: 'bearer',
    },
  },
  // 跨域设置
  cors: {
    allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
    credentials: true,
    origin: (req) => req.headers.origin,
  },
  // 日志配置
  midwayLogger: {
    clients: {
      coreLogger: {
        level: 'debug',
        consoleLevel: 'debug',
      },
      appLogger: {
        level: 'debug',
        consoleLevel: 'debug',
      },
    },
  },
} as MidwayConfig;
