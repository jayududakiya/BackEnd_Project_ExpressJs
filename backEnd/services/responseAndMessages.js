const userResponseMessages = {
  // Success Messages
  code200: "Request was successful.",
  code201: "A new user has been successfully created.",
  code204: "The operation was successful, but there is no content to return.",

  // Client Error Messages
  code400: "The request is invalid or malformed.",
  code401:
    "Authentication is required to access this resource. || Incorrect email or password. Please verify your details and try again.",
  code403:
    "You do not have permission to perform this action. || Your account is not verified. Please verify your email address before logging in.",
  code404: "The requested user was not found.",
  code409: "The user already exists.",

  // Validation Error Messages
  code422: "The request could not be processed due to validation errors.",

  // Server Error Messages
  code500: "An internal server error occurred. Please try again later.",

  // Specific Operation Messages
  createSuccess: "User has been successfully created.",
  updateSuccess: "User information has been successfully updated.",
  deleteSuccess: "User has been successfully deleted.",
  readSuccess: "User details have been successfully retrieved.",

  createError: "Failed to create the user.",
  updateError: "Failed to update the user.",
  deleteError: "Failed to delete the user.",
  readError: "Failed to retrieve the user details.",

  // Additional Messages
  invalidInput: "Invalid input provided. Please check your data.",
  unauthorizedAccess: "You are not authorized to access this resource.",
  failedToLogout: "Failed to log out from Google.",
  destroySessionError: "Failed to destroy session.",
  jwtSussesFullyLogOut: "Logged out successfully (JWT token invalidated).",
  googleAuthSussesFullyLogOut:
    "Logged out successfully (Google OAuth session cleared).",

  // Specific Error Messages for Google OAuth Callback
  googleAuthFailed: "Google authentication failed. Please try again.",
  googleLoginError: "Error logging in with Google. Please try again.",
  googleTokenGenerationError:
    "Error generating JWT token. Please try again later.",
};

module.exports = { userResponseMessages };
