import { Router } from "express";

// for validating the data coming from the API call
import { celebrate, Segments, Joi } from "celebrate";

// we need to import the ensureAuthenticated middleware to make sure a user can only update the avatar if he/she is Authenticated
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

// import the user controller
import ProfileController from "../controllers/ProfileController";

// instantiate the controller
const profileController = new ProfileController();

const profileRouter = Router();

profileRouter.use(ensureAuthenticated); // will guarantee that all routes in this file will use ensureAuthenticated middleware

profileRouter.put(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      old_password: Joi.string(),
      password: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref("password")), // we reference the field password, so these must have the same value
    },
  }),
  profileController.update
);

profileRouter.get("/", profileController.show);

export default profileRouter;
