const express = require("express");
const userRoutes = express.Router();
const {
  signUp,
  login,
  continueWithGoogle,
  getProfile,
  handleGoogleCallback,
  logOut,
} = require("../controller/user.controller");
const { verifyToken } = require("../helper/jwtToken");

// PREFIXED : "api/user"

userRoutes.post("/signup", signUp); // create user routes
userRoutes.post("/login", login);
userRoutes.get("/auth/google", continueWithGoogle);
userRoutes.get("/auth/google/callBack", handleGoogleCallback);
userRoutes.get("/logout", logOut);

userRoutes.get("/profile", verifyToken, getProfile); // Protected route to fetch user profile
userRoutes.post("/update", (req, res) => {}); // update user routes
userRoutes.post("/delete", (req, res) => {}); // deleteProfile user routes

module.exports = userRoutes;
