const jwt = require("jsonwebtoken");
const userService = require("../services/user.service");
const passwordCrypt = require("../helper/passwordCrypt");
const { createUser, deleteUser, findUser, updateUser, validateSpecificEmail } =
  new userService();
const { encryptPassword, validateSpecificPassword, decryptPassword } =
  new passwordCrypt();
const { userResponseMessages } = require("../services/responseAndMessages");
const { createToken } = require("../helper/jwtToken");
const passport = require("passport");
const signUp = async (req, res) => {
  try {
    const body = req.body;
    const existingUser = await findUser({
      email: body.email,
      isDeleted: false,
    });
    if (existingUser) {
      res.status(409).json({
        statusCode: 409,
        message: userResponseMessages.code409,
      });
      return;
    }
    const validateEmail = await validateSpecificEmail(body.email);
    const validatePassword = await validateSpecificPassword(body.password);
    if (!validatePassword.valid && !validateEmail) {
      res.status(422).json({
        statusCode: 422,
        message: userResponseMessages.code422 + "Invalid email or password",
      });
      return;
    }
    if (!validatePassword.valid) {
      res.status(422).json({ ...validatePassword, statusCode: 422 });
      return;
    }
    if (!validateEmail) {
      res
        .status(422)
        .json({ statusCode: 422, message: userResponseMessages.invalidInput });
      return;
    }

    const encryptPass = await encryptPassword(body.password);
    const user = await createUser({
      ...body,
      password: encryptPass,
    });
    res.status(201).json({
      statusCode: 201,
      message: userResponseMessages.code201,
      user: user,
    });
  } catch (error) {
    console.log("➡ ~ signUp ~ error:", error);
    res
      .status(500)
      .json({ statusCode: 500, message: userResponseMessages.code500 });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  // Check if fields are missing
  if (!email || !password) {
    return res.status(400).json({
      status: 400,
      message: "Email and password are required to log in.",
    });
  }
  try {
    const existingUser = await findUser({ email: email, isDeleted: false });
    // 1. Check if account is exist
    if (!existingUser) {
      res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.code401,
      });
      return;
    }
    // 2. Check if account is verified (skip for now)

    // 3. Check if account is disabled
    if (existingUser.isDeleted) {
      return res.status(403).json({
        statusCode: 403,
        message:
          "Your account has been disabled. Please contact support for assistance.",
      });
    }

    // 4. Verify password
    const validatePassword = await decryptPassword(
      password,
      existingUser.password
    );
    if (!validatePassword) {
      res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.code401,
      });
      return;
    }
    const token = await createToken({ uid: existingUser._id });
    if (!token) {
      return res.status(400).json({
        status: 400,
        message: "Email and password are required to log in.",
      });
    }
    // req.headers["authorization"] = `Bearer ${token}`; // INP for  test
    // // Send the token as a cookie
    // res.cookie("token", token, { httpOnly: true, secure: true }); // httpOnly for security
    // Login success
    return res.status(200).json({
      statusCode: 200,
      message: userResponseMessages.code200,
      token: token,
    });
  } catch (error) {
    console.log("➡ ~ login ~ error:", error);
    res
      .status(500)
      .json({ statusCode: 500, message: userResponseMessages.code500 });
  }
};

// const logOut = async (req, res) => {
//   try {
//     req.logOut((err) => {
//       if (err) {
//         console.error("Error logging out:", err);
//         return res.status(500).json({ msg: "Failed to log out" });
//       }
//       req.session.destroy((err) => {
//         if (err) {
//           console.error("Error destroying session:", err);
//           return res.status(500).json({ msg: "Failed to destroy session" });
//         }
//         res.clearCookie("connect.sid"); // Clear session cookie
//         return res.status(200).json({ message: "Logged out successfully" });
//       });
//     });
//   } catch (error) {
//     console.error("Error during logout:", error);
//     res.status(500).json({ msg: "An error occurred during logout" });
//   }
// };
const logOut = async (req, res) => {
  try {
    // 1. For JWT-based users (manual signup)
    if (req.headers["authorization"]) {
      const token = req.headers["authorization"].split(" ")[1];
      // Optionally, add the token to a blacklist (if implemented)
      // Example: await addToBlacklist(token);
      return res.status(200).json({
        statusCode: 200,
        message: userResponseMessages.jwtSussesFullyLogOut,
      });
    }

    // 2. For Google OAuth-based users
    if (req.isAuthenticated && req.isAuthenticated()) {
      req.logOut((err) => {
        if (err) {
          console.error("Error during Google logout:", err);
          return res
            .status(500)
            .json({ message: userResponseMessages.failedToLogout });
        }

        req.session.destroy((sessionErr) => {
          if (sessionErr) {
            console.error("Error destroying session:", sessionErr);
            return res
              .status(500)
              .json({ message: userResponseMessages.destroySessionError });
          }

          res.clearCookie("connect.sid"); // Clear session cookie for Google OAuth
          return res.status(200).json({
            statusCode: 200,
            message: userResponseMessages.googleAuthSussesFullyLogOut,
          });
        });
      });
    } else {
      // If no valid session or token, return a generic response
      res.status(400).json({
        statusCode: 400,
        message: "No active session or token found.",
      });
    }
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({
      statusCode: 500,
      message: "An error occurred during logout.",
    });
  }
};

const continueWithGoogle = async (req, res, next) => {
  try {
    passport.authenticate("google", { scope: ["profile", "email"] })(
      req,
      res,
      next
    );
  } catch (error) {
    console.log("➡ ~ continueWithGoogle ~ error:", error);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
};

// const handleGoogleCallback = async (req, res, next) => {
//   passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
//     if (err || !user) {
//       return res.status(401).json({
//         message: userResponseMessages.googleAuthFailed,
//         error: err?.message || "No user returned",
//       });
//     }
//     req.login(user, async (loginErr) => {
//       if (loginErr) {
//         console.error("Login error:", loginErr);
//         return res.status(500).json({
//           message: userResponseMessages.googleLoginError,
//           error: loginErr.message || loginErr,
//         });
//       }
//       // Optionally, generate JWT token
//       const token = await createToken({ uid: user._id });
//       if (!token) {
//         console.error("Error generating token for user:", user._id);
//         return res.status(500).json({
//           statusCode: 500,
//           message: userResponseMessages.googleTokenGenerationError,
//         });
//       }
//       return res.status(200).json({
//         statusCode: 200,
//         message: userResponseMessages.code200,
//         user: {
//           displayName: user.displayName,
//           email: user.email,
//         },
//         token,
//       });
//     });
//   })(req, res, next);
// };

const handleGoogleCallback = async (req, res, next) => {
  passport.authenticate("google", { failureRedirect: "/" }, (err, user) => {
    console.log("➡ ~ passport.authenticate ~ user:", user);
    if (err || !user) {
      console.error("Google Authentication Error: ", err || "No user returned");
      return res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.googleAuthFailed,
        error: err?.message || "No user returned",
      });
    }

    req.login(user, async (loginErr) => {
      if (loginErr) {
        return res.status(500).json({
          statusCode: 500,
          message: userResponseMessages.googleLoginError,
          error: loginErr.message || loginErr,
        });
      }

      // Optionally, generate JWT token
      try {
        const token = await createToken({ uid: user._id });
        if (!token) {
          console.error("Error generating token for user:", user._id);
          return res.status(500).json({
            statusCode: 500,
            message: userResponseMessages.googleTokenGenerationError,
          });
        }

        return res.status(200).json({
          statusCode: 200,
          message: userResponseMessages.code200,
          token,
        });
      } catch (tokenError) {
        console.error("Error during token generation:", tokenError);
        return res.status(500).json({
          statusCode: 500,
          message: userResponseMessages.googleTokenGenerationError,
          error: tokenError.message || tokenError,
        });
      }
    });
  })(req, res, next);
};

const getProfile = async (req, res) => {
  try {
    // Check if the user is authenticated
    if (!req.user) {
      return res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.unauthorizedAccess,
      });
    }

    // Log the user profile data for debugging
    console.log("User profile data:", req.user);

    // Send the profile data
    return res.status(200).json({
      statusCode: 200,
      message: userResponseMessages.readSuccess,
      user: {
        displayName: req.user.displayName,
        email: req.user.email,
      },
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({
      statusCode: 500,
      message: userResponseMessages.readError,
      error: error.message || error,
    });
  }
};

module.exports = {
  signUp,
  login,
  continueWithGoogle,
  handleGoogleCallback,
  getProfile,
  logOut,
};
