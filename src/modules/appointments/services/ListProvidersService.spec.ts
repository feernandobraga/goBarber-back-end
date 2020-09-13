import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "@modules/users/repositories/fakes/FakeUsersRepository";

// importing the service that we will test
import ListProvidersService from "./ListProvidersService";
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

let fakeUsersRepository: FakeUsersRepository;
let listProviders: ListProvidersService;
let fakeCacheProvider: FakeCacheProvider;

describe("ListProviders", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    // create the service based on the repository
    listProviders = new ListProvidersService(fakeUsersRepository, fakeCacheProvider);
  });

  it("should be able to list the providers", async () => {
    // create a new user
    const user1 = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    const user2 = await fakeUsersRepository.create({
      name: "john tre",
      email: "johndoe@example.com",
      password: "123123",
    });

    const loggedUser = await fakeUsersRepository.create({
      name: "john qua",
      email: "johndoe@example.com",
      password: "123123",
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id,
    });

    // conditions to satisfy the test
    // we use toEqual to compare the contents from the variables
    expect(providers).toEqual([user1, user2]);
  });
  //
});
