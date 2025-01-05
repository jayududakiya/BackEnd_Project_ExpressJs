// const mongoose = require("mongoose");

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     emailVerificationToken: {
//       type: String, // Stores the OTP or token for email verification
//       required: false, // Not required initially; only when sending OTP
//     },
//     emailVerificationExpires: {
//       type: Date, // Stores the expiration time for the OTP
//       required: false, // Optional, depends on when OTP is generated
//     },
//     isEmailVerified: {
//       type: Boolean, // Flag to check if the email has been verified
//       default: false, // Default is false until the user verifies their email
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// module.exports = mongoose.model("users", userSchema); // "User" is the name of the collection in MongoDB. "userSchema" is the schema for the documents in the collection. "timestamps: true" adds fields for createdAt and updatedAt timestamps.

const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // Password is required only if the user is not a Google user
      },
    },
    googleId: {
      type: String, // Stores Google OAuth ID
      unique: true,
      sparse: true, // Allows users without Google IDs to exist
    },
    provider: {
      type: String,
      default: "local", // Indicates the provider ("local" or "google")
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: {
      type: String, // Stores the OTP or token for email verification
      required: false, // Not required initially; only when sending OTP
    },
    emailVerificationExpires: {
      type: Date, // Stores the expiration time for the OTP
      required: false, // Optional, depends on when OTP is generated
    },
    isEmailVerified: {
      type: Boolean, // Flag to check if the email has been verified
      default: false, // Default is false until the user verifies their email
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

module.exports = mongoose.model("users", userSchema); // "users" is the collection name
