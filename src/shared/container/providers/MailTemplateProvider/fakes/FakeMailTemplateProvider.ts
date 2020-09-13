// importing the interface so the method can implement it
import IMailTemplateProvider from "../models/IMailTemplateProvider";

class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async parse(): Promise<string> {
    return "Fake Mail Content";
  }
}

export default FakeMailTemplateProvider;
