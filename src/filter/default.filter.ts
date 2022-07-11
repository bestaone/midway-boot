import { Catch } from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { ErrorCode } from '../common/ErrorCode';

@Catch()
export class DefaultErrorFilter {
  /**
   * 对系统抛出的异常统一处理
   */
  async catch(err: Error, ctx: Context) {
    return { code: ErrorCode.UN_ERROR, msg: err.message };
  }
}
