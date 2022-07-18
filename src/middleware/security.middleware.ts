import { Config, Inject, Middleware } from '@midwayjs/decorator';
import { Context, NextFunction } from '@midwayjs/koa';
import { httpError } from '@midwayjs/core';
import { JwtService } from '@midwayjs/jwt';
import { UserContext } from '../common/UserContext';
import { Constant } from '../common/Constant';
import { RedisService } from '@midwayjs/redis';

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
        throw new httpError.UnauthorizedError('缺少访问凭证，请添加Header[Authorization=Bearer accessToken]');
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
