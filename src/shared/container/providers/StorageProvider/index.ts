// dependency injection
import { container } from "tsyringe";

import uploadConfig from "@config/upload";

// configuring dependency injection for the mail provider
// we always link an interface to a provider or repository
import IStorageProvider from "./models/IStorageProvider";
import DiskStorageProvider from "./implementations/DiskStorageProvider";
import S3StorageProvider from "./implementations/S3StorageProvider";

const providers = {
  disk: DiskStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  "StorageProvider",
  providers[uploadConfig.driver]
);
