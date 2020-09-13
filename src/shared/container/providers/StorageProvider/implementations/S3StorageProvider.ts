// import the provider interface
import IStorageProvider from "../models/IStorageProvider";

// import fs and path and upload config to be able to deal with files
import fs from "fs";
import path from "path";
import uploadConfig from "@config/upload";

// identify the filetype
import mime from "mime";

// to handle s3 storage
import aws, { S3 } from "aws-sdk";

class DiskStorageProvider implements IStorageProvider {
  private client: S3;

  constructor() {
    this.client = new aws.S3({
      region: "ap-southeast-2",
    });
  }

  public async saveFile(file: string): Promise<string> {
    const originalPath = path.resolve(uploadConfig.tmpFolder, file); // get the path to the file locally

    const ContentType = mime.getType(originalPath);

    if (!ContentType) {
      throw new Error("File not found");
    }

    const fileContent = await fs.promises.readFile(originalPath); // read the file on the disk

    await this.client
      .putObject({
        Bucket: uploadConfig.config.aws.bucket, //bucket name on ACS
        Key: file, // file name
        ACL: "public-read", // permissions for that file
        Body: fileContent, // the actual content of the file
        ContentType,
        ContentDisposition: `inline; filename=${file}`,
      })
      .promise(); // we use .promise() so we wait for it to finish

    await fs.promises.unlink(originalPath);

    return file;
  }

  public async deleteFile(file: string): Promise<void> {
    await this.client
      .deleteObject({
        Bucket: uploadConfig.config.aws.bucket, //bucket name on ACS
        Key: file, //file name
      })
      .promise();
  }
}

export default DiskStorageProvider;
