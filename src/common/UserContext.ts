/**
 * 登陆后存储访问上下文的状态数据，同时也会存在redis缓存中
 */
export class UserContext {
  userId: number;
  username: string;
  phoneNum: string;
  constructor(userId: number, username: string, phoneNum: string) {
    this.userId = userId;
    this.username = username;
    this.phoneNum = phoneNum;
  }
}
