// redis options to strongly type the configuration parameters
import { RedisOptions } from "ioredis";

// interface to strongly type the export of this configuration file
interface ICacheConfig {
  driver: "redis";

  config: {
    redis: RedisOptions;
  };
}

export default {
  driver: "redis",

  config: {
    // configs for redis
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASS || undefined, //will only require a password in development mode
    },
  },
} as ICacheConfig;
