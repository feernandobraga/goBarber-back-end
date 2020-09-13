import { Router } from "express";

import appointmentsRouter from "@modules/appointments/infra/http/routes/appointments.routes";
import providersRouter from "@modules/appointments/infra/http/routes/providers.routes";
import usersRouter from "@modules/users/infra/http/routes/users.routes";
import sessionsRouter from "@modules/users/infra/http/routes/sessions.routes";
import passwordRouter from "@modules/users/infra/http/routes/password.routes";
import profileRouter from "@modules/users/infra/http/routes/profile.routes";

const routes = Router();

// this redirects every hit to /appointments to the appointments.routes.ts file
routes.use("/appointments", appointmentsRouter);

// this redirects every hit to /users to the users.routes.ts file
routes.use("/users", usersRouter);

// this redirects every hit to /sessions to the sessions.routes.ts file
routes.use("/sessions", sessionsRouter);

// redirect the user to the appropriate routes if the route is /password
routes.use("/password", passwordRouter);

// redirect the user to the appropriate routes if the route is /profile
routes.use("/profile", profileRouter);

// redirect the user to the appropriate routes if the route is /profile
routes.use("/providers", providersRouter);

export default routes;
