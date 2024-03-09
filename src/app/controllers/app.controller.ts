import express, { Request, Response, Router, request } from "express";
import flash from "express-flash";
import { pino } from "pino";
import passport from "passport";
import session from "express-session";
import controller from "./router.controller";
import middleware from "../middleware/middleware";
import keys from "./keys.js";
require("./passport");
import cookieParser from "cookie-parser";

export class AppController {
  public router: Router = Router();
  private log: pino.Logger = pino();

  constructor() {
    this.initializeRouter();
  }

  private initializeRouter() {
    this.router.use(cookieParser());
    this.router.use(
      session({
        name: "test",
        secret: "orange icecream",
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: true,
          maxAge: 60000,
        },
      })
    );
    this.router.use(express.urlencoded({ extended: true }));
    this.router.use(flash());
    this.router.use(passport.initialize());
    this.router.use(passport.session());
    this.router.use(middleware.flashMessages);

    // Serve the home page
    this.router.get("/", controller.home);

    // Serve the calendar page
    this.router.get("/calendar", controller.calendar);

    this.router.get("/profile", controller.profile);

    // auth login
    this.router.get("/login", controller.login);

    // auth logout
    this.router.get("/logout", middleware.loginCheck, controller.home);

    this.router.get(
      "/google",
      controller.google,
      passport.authenticate("google", {
        scope: ["email", "profile", "openid"],
      })
    );

    this.router.get(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      controller.gCallback
    );

    this.router.post(
      "/google/callback",
      passport.authenticate("google", { failureRedirect: "/login" }),
      controller.googleCallback
    );
  }
}
