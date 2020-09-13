import { Router } from "express";

// import container for dependency in

// we need to import the ensureAuthenticated middleware to make sure a user can only update the avatar if he/she is Authenticated
import ensureAuthenticated from "../middlewares/ensureAuthenticated";

// import multer to handle the avatar
import multer from "multer";

// for validating the data coming from the API call
import { celebrate, Segments, Joi } from "celebrate";

//import the upload configuration file
import uploadConfig from "@config/upload";

// import the user avatar controller
import UserAvatarController from "../controllers/UserAvatarController";

// import the user controller
import UsersController from "../controllers/UsersController";

// instantiate the controller
const usersController = new UsersController();

// instantiate the user avatar controller
const userAvatarController = new UserAvatarController();

const usersRouter = Router();

// we will use this variable to handle the upload file
const upload = multer(uploadConfig.multer);

/**
 * POST to localhost:3333/users
 * route to create a new user
 */
usersRouter.post(
  "/",
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
);

/**
 * PATCH to localhost:3333/users/avatar
 * Route to update the user with an avatar image.
 * We use PATCH when we need to update just a single piece of information about the entity
 * We use PUT when we update the entire entity
 * The route also takes the middleware to ensure the user must be authenticated before updating the avatar
 * It also takes a SECOND middleware (upload.single('avatar')) that will handle the file that is passed
 * The method .single() takes as a parameter the name of the field that will contain the image when the route is called
 */
usersRouter.patch(
  "/avatar",
  ensureAuthenticated,
  upload.single("avatar"),
  userAvatarController.update
);

export default usersRouter;
