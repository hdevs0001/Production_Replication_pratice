// src/server.ts
import 'dotenv/config';
import './instrument'; // must load before app.ts and anything it imports

import app from './app';
import { config } from './config';
import { logger } from './utils/logger';

app.listen(config.port, () => {
  logger.info('server started', {
    port: config.port,
    env: config.nodeEnv,
  });
});