// importing the DTO with the params for the template
import IParseMailTemplateDTO from "@shared/container/providers/MailTemplateProvider/dtos/IParseMailTemplateDTO";

// interface containing the information about the mail recipient
interface IMailContact {
  name: string;
  email: string;
}

export default interface ISendMailDTO {
  to: IMailContact;
  from?: IMailContact;
  subject: string;
  templateData: IParseMailTemplateDTO;
}
