import { ILogger, IMiddleware } from '@midwayjs/core';
import { Inject, Middleware } from '@midwayjs/decorator';
import { NextFunction, Context } from '@midwayjs/koa';

/**
 * 统计接口耗时
 */
@Middleware()
export class ReportMiddleware implements IMiddleware<Context, NextFunction> {
  @Inject()
  logger: ILogger;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      const startTime = Date.now();
      const result = await next();
      this.logger.debug(Date.now() - startTime);
      return result;
    };
  }

  static getName(): string {
    return 'API_REPORT';
  }
}
