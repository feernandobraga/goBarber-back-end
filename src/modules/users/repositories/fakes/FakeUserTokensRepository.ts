import User from "../../infra/typeorm/entities/User";

import { uuid } from "uuidv4";

// importing the interface with the methods from the repository
import IUserTokensRepository from "@modules/users/repositories/IUserTokensRepository";

// importing the UserToken model so the method generate can return it
import UserToken from "../../infra/typeorm/entities/UserToken";

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = this.userTokens.find((findToken) => findToken.token === token);

    return userToken;
  }
}

export default FakeUserTokensRepository;
