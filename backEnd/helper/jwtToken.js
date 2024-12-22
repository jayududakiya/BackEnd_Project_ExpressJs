const jwt = require("jsonwebtoken");
const jwt_secretKey = process.env.JWT_SECRET_KEY;
const { userResponseMessages } = require("../services/responseAndMessages");
const userService = require("../services/user.service");
const { findUser } = new userService();

const verifyToken = async (req, res, next) => {
  try {
    const authToken = req.headers["authorization"];
    if (!authToken) {
      res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.code401,
      });
      return;
    }
    const token = authToken.split(" ")[1];
    const {
      payload: { uid },
    } = await jwt.verify(token, jwt_secretKey);
    const existingUser = await findUser({ _id: uid, isDeleted: false });
    if (!existingUser) {
      return res.status(401).json({
        statusCode: 401,
        message: userResponseMessages.code401,
      });
    }
    const user = existingUser.toObject();
    delete user.password;
    req.user = user;
    next();
  } catch (error) {
    console.log("➡ verifyToken ~ error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: userResponseMessages.code500,
    });
  }
};

const createToken = async (payload) => {
  try {
    return await jwt.sign({ payload }, jwt_secretKey, {
      expiresIn: "1h", // Token will expire in 1 hour
    });
  } catch (error) {
    console.log("➡ createToken ~ error:", error);
    return res.status(500).json({
      statusCode: 500,
      message: userResponseMessages.code500,
    });
  }
};

module.exports = { verifyToken, createToken };
