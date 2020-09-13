// importing the fake repository that has the functions that will be used by the service we want to test against
import FakeAppointmentsRepository from "../repositories/fakes/FakeAppointmentsRepository";

import AppError from "@shared/errors/AppError";

import FakeNotificationsRepository from "@modules/notifications/repositories/fakes/FakeNotificationsRepository";

// to handle cache tests
import FakeCacheProvider from "@shared/container/providers/CacheProvider/fakes/FakeCacheProvider";

// importing the service that we will test
import CreateAppointmentService from "./CreateAppointmentService";

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;
let fakeCacheProvider: FakeCacheProvider;

describe("CreateAppointment", () => {
  beforeEach(() => {
    // instantiates the repository and then the service, by passing the repository created
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository,
      fakeCacheProvider
    );
  });

  it("should be able to create a new appointment", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    // create a new appointment
    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: "123123",
      provider_id: "33333",
    });

    // conditions to satisfy the test
    expect(appointment).toHaveProperty("id"); // appointment should have an id
    expect(appointment.provider_id).toBe("33333"); // provider_id should be '123123'
  });

  it("should not be able to create two appointments on the same date", async () => {
    const appointmentDate = new Date(2020, 10, 10, 11);

    // create a new appointment
    await createAppointment.execute({
      date: appointmentDate,
      user_id: "123123",
      provider_id: "321321",
    });

    // create a new appointment with the same date
    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: "123123",
        provider_id: "321321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able to create an appointment on a past date", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: "123123",
        provider_id: "321321",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
  it("should not be able to create an appointment with him/herself", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: "123123",
        provider_id: "123123",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //

  it("should not be able to create an appointment out of the business hours (8-17)", async () => {
    jest.spyOn(Date, "now").mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 7),
        user_id: "123123",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 11, 18),
        user_id: "123123",
        provider_id: "provider-id",
      })
    ).rejects.toBeInstanceOf(AppError);
  });
  //
});
