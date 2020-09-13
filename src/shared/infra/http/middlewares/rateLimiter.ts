import { Request, Response, NextFunction } from "express";

import { RateLimiterRedis } from "rate-limiter-flexible"; // to prevent API requests abuse and store the data with Redis
import redis from "redis"; // to use redis
import AppError from "@shared/errors/AppError";

const redisClient = redis.createClient({
  // instantiate Redis
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined, //will only require a password in development mode
});

const limiter = new RateLimiterRedis({
  // instantiate the rateLimiter
  storeClient: redisClient,
  keyPrefix: "ratelimit",
  points: 5, //number of API calls within a time frame
  duration: 1, // 1 second
});

export default async function rateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    await limiter.consume(request.ip);

    return next();
  } catch (err) {
    throw new AppError("Too many requests, 429");
  }
}
