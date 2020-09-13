import IMailProvider from "../models/IMailProvider";

// tsyring for dependency injection
import { injectable, inject } from "tsyringe";

// importing the mail service provider
import nodemailer, { Transporter } from "nodemailer";

// importing the dto with information about the params needed to send an email
import ISendMailDTO from "../dtos/ISendMailDTO";

// getting the interface to handle templates
import IMailTemplateProvider from "@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider";

@injectable()
export default class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject("MailTemplateProvider")
    private mailTemplateProvider: IMailTemplateProvider
  ) {
    nodemailer.createTestAccount().then((account) => {
      const transporter = nodemailer.createTransport({
        host: account.smtp.host,
        port: account.smtp.port,
        secure: account.smtp.secure,
        auth: {
          user: account.user,
          pass: account.pass,
        },
      });

      this.client = transporter;
    });
  }

  public async sendMail({
    to,
    from,
    subject,
    templateData,
  }: ISendMailDTO): Promise<void> {
    // this is the name I gave to the function
    const message = await this.client.sendMail({
      // this sendMail() method is from the Ethereal
      from: {
        name: from?.name || "GoBarber Team",
        address: from?.email || "team@gobarber.com",
      },
      to: {
        name: to.name,
        address: to.email,
      },
      subject: "Password recover",
      html: await this.mailTemplateProvider.parse(templateData),
    });

    // verifying if the message was sent
    console.log("Message sent: %s", message.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(message));
  }
}
