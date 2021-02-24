const express = require("express");
const Session = require("../app/controllers/sessionController");
const { login } = require("../app/middlewares/validators/session");

const routes = express.Router();

routes.get("/login", Session.loginForm);
routes.post("/login", login, Session.login);

module.exports = routes;
