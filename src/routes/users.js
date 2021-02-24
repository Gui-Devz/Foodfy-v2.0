const express = require("express");
const Session = require("../app/controllers/sessionController");

const routes = express.Router();

routes.get("/login", Session.loginForm);

module.exports = routes;
