import { Router } from "express";

// for validating the data coming from the API call
import { celebrate, Segments, Joi } from "celebrate";

// importing the controller
import SessionsController from "../controllers/SessionsController";

// instantiate the controller
const sessionsController = new SessionsController();

const sessionsRouter = Router();

/**
 * POST to localhost:3333/sessions
 * since this will save data to the database, it may take a while, and therefore, we need to handle asynchronous data.
 * We do that by making it an async method and using await in the execute() method.
 */
sessionsRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  sessionsController.create
);

export default sessionsRouter;
