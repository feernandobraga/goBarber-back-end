import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

// importing the service that we will reset the password
import ResetPasswordService from "./ResetPasswordService";

//import the repository responsible for creating fake tokens
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

//importing fake hash provider to hash the password
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPassword: ResetPasswordService;

describe("ResetPasswordService", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    // instantiate the service with the repositories via dependency injection
    resetPassword = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider
    );
  });

  it("should be able to reset the password", async () => {
    //monitor if the method sendMail was called

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, "generateHash");

    await resetPassword.execute({
      password: "123123",
      token,
    });

    const updatedUser = await fakeUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith("123123");
    expect(updatedUser?.password).toBe("123123");
  });
  //
  it("should not be able to reset the password with non-existent token", async () => {
    await expect(
      resetPassword.execute({
        token: "non-existent-token",
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able to reset the password with non-existent user", async () => {
    const { token } = await fakeUserTokensRepository.generate("non-existent-user");

    await expect(
      resetPassword.execute({
        token,
        password: "123456",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able to reset the password with expired token", async () => {
    //monitor if the method sendMail was called

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      // this will return the time 3 hours ahead from now
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 14);
    });

    await expect(
      resetPassword.execute({
        password: "123123",
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
});
