import IParseMailTemplateDTO from "../dtos/IParseMailTemplateDTO";

export default interface IMailTemplateProvider {
  /**
   * method parse will receive the params according to the DTO and will return a string
   */
  parse(data: IParseMailTemplateDTO): Promise<string>;
}
