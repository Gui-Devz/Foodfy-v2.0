const express = require("express");

const sessionController = require("../app/controllers/sessionController");
const {
  checkFormForgot,
  checkFormLogin,
  checkFormReset,
} = require("../app/middlewares/validators/session");
const { isLogged } = require("../app/middlewares/validators/users");

const routes = express.Router();

//SESSION ROUTES
routes.get("/login", isLogged, sessionController.loginForm);
routes.get("/forgot-password", isLogged, sessionController.forgotForm);
routes.get("/reset-password", isLogged, sessionController.resetForm);
routes.get("/logout", isLogged, sessionController.logout);

routes.post("/login", checkFormLogin, sessionController.login);
routes.post("/forgot-password", checkFormForgot, sessionController.forgot);
routes.post("/reset-password", checkFormReset, sessionController.reset);

module.exports = routes;
