// dependency injection
import { container } from "tsyringe";

// the configuration file that sets the correct driver
import mailConfig from "@config/mail";

// configuring dependency injection for the mail template provider
// we always link an interface to a provider or repository
import IMailTemplateProvider from "./models/IMailTemplateProvider";
import HandlebarsMailTemplateProvider from "./implementations/HandlebarsMailTemplateProvider";

const providers = {
  handlebars: HandlebarsMailTemplateProvider,
};

container.registerSingleton<IMailTemplateProvider>(
  "MailTemplateProvider",
  providers.handlebars
);
