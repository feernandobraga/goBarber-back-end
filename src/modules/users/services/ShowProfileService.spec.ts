import AppError from "@shared/errors/AppError";
// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeUsersRepository from "../repositories/fakes/FakeUsersRepository";

// importing the service that we will test
import ShowProfileService from "./ShowProfileService";

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeUsersRepository = new FakeUsersRepository();

    // create the service based on the repository
    showProfile = new ShowProfileService(fakeUsersRepository);
  });

  it("should be able to display the user profile", async () => {
    // create a new user
    const user = await fakeUsersRepository.create({
      name: "john doe",
      email: "johndoe@example.com",
      password: "123123",
    });

    const profile = await showProfile.execute({
      user_id: user.id,
    });

    // conditions to satisfy the test
    expect(profile.name).toBe("john doe");
    expect(profile.email).toBe("johndoe@example.com");
  });
  //
  it("should not be able to display the user profile if the user doesn't exist", async () => {
    await expect(
      showProfile.execute({
        user_id: "non-existing user id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
