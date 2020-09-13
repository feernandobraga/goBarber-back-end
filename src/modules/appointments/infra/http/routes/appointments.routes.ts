import { Router } from "express";

// for data validation
import { celebrate, Segments, Joi } from 'celebrate'

// importing the middleware so routes are automatically verified for the token
import ensureAuthenticated from "@modules/users/infra/http/middlewares/ensureAuthenticated";

// import the controller
import AppointmentsController from "../controllers/AppointmentsController";
import ProviderAppointmentsController from "../controllers/ProviderAppointmentsController";

// instantiating a new controller
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

const appointmentsRouter = Router();

// adds the middleware checking to all rotes related to appointments
appointmentsRouter.use(ensureAuthenticated);

appointmentsRouter.post("/", celebrate({
  [Segments.BODY] : { // this will get the fields from the API request body
    provider_id: Joi.string().uuid().required(), // this ensures that the field provider_id is a string, of uuid type and mandatory
    date: Joi.date().required() // ensures the date has a date formate and is required
  }
}), appointmentsController.create);

// display all appointments for the logged provider
appointmentsRouter.get("/me", providerAppointmentsController.index);

export default appointmentsRouter;
