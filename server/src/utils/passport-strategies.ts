import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { JwtFromRequestFunction, Strategy as JWTStrategy } from "passport-jwt";
import bcrypt from "bcrypt";
import { Application } from "express";
import { db } from "../server";
import envConfig from "../env/envConfig";

export const configurePassport = (app: Application) => {
  //our local strategy for initial log
  passport.use(
    new LocalStrategy(
      //just to ensure that we are referencing the correct field
      { usernameField: "email" },
      //our verify callback function
      async (email, password, done) => {
        try {
          //find out user in db
          const userFound = await db.getUserDB().findUser(["email", email]);
          //if we cant find the user or the user does not have a password return error
          if (
            userFound instanceof Error ||
            !userFound[0] ||
            !userFound[0].password
          )
            return done(null, false);
          //check is password correct
          const passwordMatches = await bcrypt.compare(
            password,
            userFound[0].password
          );
          if (!passwordMatches) return done(null, false);
          //delete sensitive data before returning object
          delete userFound[0].password;
          return done(null, userFound[0]);
        } catch (error) {
          console.log(error);
          return done(error);
        }
      }
    )
  );

  //set up our JWT Strategy
  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: cookieExtractor,
        secretOrKey: envConfig.auth.jwtSecret,
      },
      (payload, done) => {
        try {
          done(null, payload);
        } catch (error) {
          done(error);
        }
      }
    )
  );

  //once we have configured out strategies we set initialise them
  app.use(passport.initialize());
};

//this is the functiont that is plugged into JWTFromRequest config options
const cookieExtractor: JwtFromRequestFunction = (req) => {
  let token = null;

  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }

  return token;
};
