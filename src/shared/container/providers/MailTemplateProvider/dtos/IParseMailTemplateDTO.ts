interface ITemplateVariables {
  [key: string]: string | number; // we use [key:string]: when we don't know what they keys will be. It can be name, link, age, banana...
}

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
