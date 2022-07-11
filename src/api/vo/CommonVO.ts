import { ApiProperty } from '@midwayjs/swagger';

export class LoginVO {
  @ApiProperty({ description: '访问凭证' })
  accessToken: string;
  @ApiProperty({ description: '有效时长（s）' })
  expiresIn: number;
}
