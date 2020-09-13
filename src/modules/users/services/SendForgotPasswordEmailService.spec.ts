import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

// importing the service that we will test
import SendForgotPasswordEmailService from "./SendForgotPasswordEmailService";

// import fake mail provider
import FakeMailProvider from "@shared/container/providers/MailProvider/fakes/FakeMailProvider";

//import the repository responsible for creating fake tokens
import FakeUserTokensRepository from "../repositories/fakes/FakeUserTokensRepository";

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe("SendForgotPasswordEmail", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    // instantiate the service with the repositories via dependency injection
    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository
    );
  });

  it("should be able to retrieve password via email", async () => {
    //monitor if the method sendMail was called
    const sendMail = jest.spyOn(fakeMailProvider, "sendMail");

    await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({
      email: "johndoe@example.com",
    });

    // conditions to satisfy the test - checks if the method sendMail was ever executed
    expect(sendMail).toHaveBeenCalled();
  });

  it("should not be able to recover the password for a non-existent user", async () => {
    // conditions to satisfy the test - checks if the method sendMail was ever executed
    await expect(
      sendForgotPasswordEmail.execute({
        email: "johndoe@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should generate a forgot password token", async () => {
    //monitor if the method sendMail was called
    const generateToken = jest.spyOn(fakeUserTokensRepository, "generate");

    const user = await fakeUsersRepository.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });

    await sendForgotPasswordEmail.execute({
      email: "johndoe@example.com",
    });

    // conditions to satisfy the test - checks if the method sendMail was ever executed
    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
