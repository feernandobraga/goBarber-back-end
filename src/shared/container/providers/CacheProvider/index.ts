// dependency injection
import { container } from "tsyringe";

// configuring dependency injection for the mail provider
// we always link an interface to a provider or repository
import ICacheProvider from "./models/ICacheProvider";
import RedisCacheProvider from "./implementations/RedisCacheProvider";

const providers = {
  redis: RedisCacheProvider,
};

container.registerSingleton<ICacheProvider>("CacheProvider", providers.redis);
