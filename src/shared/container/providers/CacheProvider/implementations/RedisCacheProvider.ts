import ICacheProvider from "../models/ICacheProvider"; // import the interface

import cacheConfig from "@config/cache"; // contains the configurations to instantiate a connection with redis database

import Redis, { Redis as RedisClient } from "ioredis"; // to handle Redis operations/requests

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis); // gets configs like port, host and password from configuration file
  }

  public async save(key: string, value: any): Promise<void> {
    await this.client.set(key, JSON.stringify(value)); // redis saves stuff as key:value pair
  }
  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key); // retrieve the key-pair from redis based on a given key

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T; // parses the data to whatever type was attributed to the method recover in the service

    return parsedData;
  }

  public async invalidate(key: string): Promise<void> {
    // delete a key from redis
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    // delete all key-value pairs based on a given prefix
    const keys = await this.client.keys(`${prefix}:*`); // retrieve all keys for a given prefix

    const pipeline = this.client.pipeline(); // create a pipeline for deletion just because pipelines have a better performance

    keys.forEach((key) => {
      pipeline.del(key); // use pipeline to delete all keys starting with the given prefix
    });

    await pipeline.exec(); // execute the pipeline
  }
}
