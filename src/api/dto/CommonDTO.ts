import { Rule, RuleType } from '@midwayjs/validate';
import { ApiProperty } from '@midwayjs/swagger';

/**
 * 登陆DTO
 */
export class LoginDTO {
  @ApiProperty({ example: 'zhangsan', description: '用户名' })
  @Rule(RuleType.string().required().min(5).max(20))
  username: string;

  @ApiProperty({ example: 'Abc_12345', description: '密码' })
  @Rule(RuleType.string().required().min(5).max(20))
  password: string;
}
