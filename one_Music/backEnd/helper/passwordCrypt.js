const bcrypt = require("bcrypt");
const saltRounds = Number(process.env.SALT_ROUNDS) || 10;

class PasswordCrypt {
  async encryptPassword(password) {
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.log("Error encrypting password:", error);
      throw new Error("Password encryption failed");
    }
  }

  async decryptPassword(usePassword, hashedPassword) {
    try {
      const isPasswordOk = await bcrypt.compare(usePassword, hashedPassword);
      return isPasswordOk;
    } catch (error) {
      console.log("Error decrypting password:", error);
      throw new Error("Password comparison failed");
    }
  }

  async validateSpecificPassword(password) {
    const errors = [];
    // Pass123! valid
    if (password.length < 8) {
      errors.push("Must be at least 8 characters long.");
    }
    if (!/[A-Z]/.test(password)) {
      errors.push("Must include at least one uppercase letter.");
    }
    if (!/[a-z]/.test(password)) {
      errors.push("Must include at least one lowercase letter.");
    }
    if (!/\d/.test(password)) {
      errors.push("Must include at least one number.");
    }
    if (!/[!@#$%^&*()]/.test(password)) {
      errors.push("Must include at least one special character (!@#$%^&*()).");
    }

    return errors.length === 0
      ? { valid: true, message: "Password is valid." }
      : {
          valid: false,
          message: "Password validation failed.",
          errors: errors.join(" & "),
        };
  }
}

module.exports = PasswordCrypt;
