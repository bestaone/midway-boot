import '@midwayjs/core';
import { UserContext } from './common/UserContext';

declare module '@midwayjs/core' {
  interface Context {
    userContext: UserContext;
  }
}
