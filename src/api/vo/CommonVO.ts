import { ApiProperty } from '@midwayjs/swagger';
import {PickDto} from '@midwayjs/validate'
import {User} from '../../entity/user'

/**
 * 登陆成功后返回的VO
 */
export class LoginVO {
  @ApiProperty({ description: '访问凭证' })
  accessToken: string;
  @ApiProperty({ description: '有效时长（s）' })
  expiresIn: number;
}

/**
 * 去除密码，但是对应泛型不太适用
 */
export class UserVO extends PickDto(User, []) {}
