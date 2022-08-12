import { IMiddleware } from '@midwayjs/core';
import {Config, Middleware} from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';
import { ErrorCode } from '../common/ErrorCode';

/**
 * 对接口返回的数据统一包装
 */
@Middleware()
export class FormatMiddleware implements IMiddleware<Context, NextFunction> {
  @Config('app.security')
  securityConfig;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const result = await next();
      ctx.response.status = 200;
      return result!=null ? { code: ErrorCode.OK, msg: 'OK', data: result } : { code: ErrorCode.OK, msg: 'OK' };
    };
  }

  match(ctx) {
    const { prefix } = this.securityConfig;
    return ctx.path.indexOf(prefix) === 0;
  }

  static getName(): string {
    return 'API_RESPONSE_FORMAT';
  }
}
