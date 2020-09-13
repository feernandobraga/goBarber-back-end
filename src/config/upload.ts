import path from "path";
import multer, { StorageEngine } from "multer";

// method used to create hashed
import crypto from "crypto";

/**
 * Here, we need to export a few things:
 * storage: multer.diskStorage({})
 *  |- the diskStorage() methods takes two params: the destination and the filename
 *  |- filename is a function that receives the request from express, the file and a callback
 *      |- the callback is a function that we call after generating the name of the file
 */

// interface to define the type of driver
interface IUploadConfig {
  driver: "s3" | "disk";

  tmpFolder: string;
  uploadsFolder: string;

  multer: {
    storage: StorageEngine;
  };

  config: {
    disk: {};
    aws: {
      bucket: string;
    };
  };
}

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp");

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder,
  uploadsFolder: path.resolve(tmpFolder, "uploads"),

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        // here we are going to hash the filename, so it doesn't not occur of two users uploading a file with the same name
        const fileHash = crypto.randomBytes(10).toString("hex");
        const fileName = `${fileHash}-${file.originalname}`;

        return callback(null, fileName);
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: "me.fernandobraga.app-gobarber",
    },
  },
} as IUploadConfig;
