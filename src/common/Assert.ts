import { CommonException } from './CommonException';

/**
 * 断言工具类
 */
export class Assert {
  /**
   * 不为空断言
   */
  static notNull(obj: any, errorCode: number, errorMsg: string) {
    if (!obj) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 空字符串断言
   */
  static notEmpty(obj: any, errorCode: number, errorMsg: string) {
    if (!obj || '' === obj.trim()) {
      throw new CommonException(errorCode, errorMsg);
    }
  }

  /**
   * 布尔断言
   */
  static isTrue(expression: boolean, errorCode: number, errorMsg: string) {
    if (!expression) {
      throw new CommonException(errorCode, errorMsg);
    }
  }
}
