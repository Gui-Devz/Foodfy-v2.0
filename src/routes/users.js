const express = require("express");

const sessionController = require("../app/controllers/sessionController");
const { login } = require("../app/middlewares/validators/session");

const routes = express.Router();

//SESSION ROUTES
routes.get("/login", sessionController.loginForm);
routes.get("/forgot-password", sessionController.forgotForm);
routes.get("/reset-password", sessionController.resetForm);
routes.get("/logout", sessionController.logout);

routes.post("/login", login, sessionController.login);
routes.post("/forgot-password", login, sessionController.forgot);
routes.post("/reset-password", login, sessionController.reset);

module.exports = routes;
