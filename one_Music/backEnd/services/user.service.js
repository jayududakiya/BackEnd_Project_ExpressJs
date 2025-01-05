const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
// const validator = require("validator");

class userServices {
  async createUser(body) {
    const user = await User.create(body);
    return user;
  }
  async findUser(body) {
    const user = await User.findOne(body);
    return user;
  }
  async updateUser(body) {
    const user = await User.updateOne();
    return user;
  }
  async deleteUser(body) {
    const user = await User.deleteOne();
    return user;
  }

  async validateSpecificEmail(email) {
    // const validEmail = validator.isEmail(email);
    const emailRegex = /^[^\s@]+@(yahoo\.com|gmail\.com|test\.in)$/i;
    return emailRegex.test(email);
  }
}

module.exports = userServices;
