import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

// importing the fake storage repository
import FakeHashProvider from "../providers/HashProvider/fakes/FakeHashProvider";

// importing the service that we will test
import UpdateProfileService from "./UpdateProfileService";

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    // create the service based on the repository
    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider);
  });

  it("should be able to update the user profile", async () => {
    // create a new user
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "James Smith",
      email: "jamessmith@example.com",
    });

    // conditions to satisfy the test
    expect(updatedUser.name).toBe("James Smith");
    expect(updatedUser.email).toBe("jamessmith@example.com");
  });
  //
  it("should not be able to update the email to an already taken one", async () => {
    // create a new user
    await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    const user = await fakeUsersRepository.create({
      name: "James Smith",
      email: "jamessmith@example.com",
      password: "123456",
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "Pafuncio",
        email: "johndoe@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should be able update the password", async () => {
    // create a new user
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: "James Smith",
      email: "jamessmith@example.com",
      old_password: "123123",
      password: "abcde",
    });

    // conditions to satisfy the test
    expect(updatedUser.password).toBe("abcde");
  });
  //
  it("should not be able update the password without providing the old password", async () => {
    // create a new user
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    // conditions to satisfy the test
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "James Smith",
        email: "jamessmith@example.com",
        password: "abcde",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able update the password providing the wrong old password", async () => {
    // create a new user
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    // conditions to satisfy the test
    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: "James Smith",
        email: "jamessmith@example.com",
        old_password: "wrong-old-password",
        password: "abcde",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able to update the user profile if the user doesn't exist", async () => {
    await expect(
      updateProfile.execute({
        user_id: "non-existing user id",
        name: "any name",
        email: "jamessmith@example.com",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
