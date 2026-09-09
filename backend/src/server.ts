// src/server.ts
import 'dotenv/config'; // must be first — before any other import

import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

app.listen(config.port, () => {
  logger.info('server started', {
    port: config.port,
    env: config.nodeEnv,
  });
});