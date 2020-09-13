import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

// importing the service that we will test
import AuthenticateUserService from "./AuthenticateUserService";

// importing the hashing provider
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

// import the service to create user
import CreateUserService from "./CreateUserService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe("AuthenticateUser", () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    authenticateUser = new AuthenticateUserService(fakeUsersRepository, fakeHashProvider);
  });

  it("should be able to authenticate", async () => {
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    // create a new user
    const response = await authenticateUser.execute({
      email: "johndoe@example.com",
      password: "123123",
    });

    // conditions to satisfy the test
    expect(response).toHaveProperty("token"); // response should have a token property
    expect(response.user).toEqual(user); // response.user should be equal to the user we created
  });

  it("should not be able to authenticate with a non-existent user", async () => {
    // conditions to satisfy the test
    await expect(
      authenticateUser.execute({
        email: "johndoe@example.com",
        password: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with wrong credentials", async () => {
    await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    // conditions to satisfy the test
    await expect(
      authenticateUser.execute({
        email: "johndoe@example.com",
        password: "wrong-password",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
