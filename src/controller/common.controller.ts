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
