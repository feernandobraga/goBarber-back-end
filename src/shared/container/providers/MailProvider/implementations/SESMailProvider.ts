import IMailProvider from "../models/IMailProvider";

// tsyring for dependency injection
import { injectable, inject } from "tsyringe";

// importing the mail service provider
import nodemailer, { Transporter } from "nodemailer";

// for handling Amazon SES
import aws from "aws-sdk";

// contains configuration parameters for SES
import mailConfig from "@config/mail";

// importing the dto with information about the params needed to send an email
import ISendMailDTO from "../dtos/ISendMailDTO";

// getting the interface to handle templates
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";

@injectable()
export default class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    this.client = nodemailer.createTransport({
      // instantiates the SES in the constructor
      SES: new aws.SES({
        apiVersion: "2010-12-01",
        region: "ap-southeast-2",
      }),
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    const { name, email } = mailConfig.defaults.from; // get default values for name and email from config file

    await this.client.sendMail({
      from: {
        name: from?.name || name,
        address: from?.email || email,
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject,
      html: await this.mailTemplateProvider.parse(templateData),
    });
  }
}
