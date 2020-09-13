import { Router } from "express";

// importing the controller
import ForgotPasswordController from "../controllers/ForgotPasswordController";
import ResetPasswordController from "../controllers/ResetPasswordController";

// for validating the data coming from the API call
import { celebrate, Segments, Joi } from "celebrate";

// instantiate the controllers
const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

const passwordRouter = Router();

// localhost:3333/password/forgot
passwordRouter.post(
  "/forgot",
  celebrate({
    [Segments.BODY]: {
      email: Joi.string().email().required(),
    },
  }),
  forgotPasswordController.create
);

// localhost:3333/password/reset
passwordRouter.post(
  "/reset",
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref("password")), // we reference the field password, so these must have the same value
    },
  }),
  resetPasswordController.create
);

export default passwordRouter;
