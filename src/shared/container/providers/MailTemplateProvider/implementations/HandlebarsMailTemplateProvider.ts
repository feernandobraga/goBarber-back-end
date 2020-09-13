// importing the interface so the method can implement it
import IMailTemplateProvider from "../models/IMailTemplateProvider";

// import the dto that contains the type of the arguments the function parse receives
import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

// importing the handlebars, which is the service that will handle the templates
import handlebars from "handlebars";

// fs to handle the template file
import fs from "fs";

class HandlebarsMailTemplateProvider implements IMailTemplateProvider {
  public async parse({ file, variables }: IParseMailTemplateDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: "utf-8",
    });

    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}

export default HandlebarsMailTemplateProvider;
