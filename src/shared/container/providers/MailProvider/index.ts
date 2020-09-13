// dependency injection
import { container } from "tsyringe";

// the configuration file that sets the correct driver
import mailConfig from "@config/mail";

// configuring dependency injection for the mail provider
// we always link an interface to a provider or repository
import IMailProvider from "./models/IMailProvider";

import EtherealMailProvider from "./implementations/EtherealMailProvider";
import SESMailProvider from "./implementations/SESMailProvider";

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider),
};

//this one is different just to make sure it executes the constructor of this class
container.registerInstance<IMailProvider>("MailProvider", providers[mailConfig.driver]); // gets the value from mail config file
