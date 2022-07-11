import { MidwayConfig } from '@midwayjs/core';

export default {
  midwayLogger: {
    clients: {
      coreLogger: {
        level: 'info',
        consoleLevel: 'info',
      },
      appLogger: {
        level: 'info',
        consoleLevel: 'info',
      },
    },
  },
} as MidwayConfig;
