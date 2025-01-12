const verifyAccountTemplate = (token) => {
  const template = `
    <h1>Verify Your Account</h1>
    <p>Click the link below to verify your account:</p>
    <a href="http://localhost:4000/auth/verify-account/${token}">Verify Account</a>
    `;
  return template;
};

// Manage with Frontend
const forgotPasswordTemplate = (token) => {
  const template = `
    <h1>Forgot Password</h1>
    <p>Click the link below to reset your password:</p>
    <a href="http://localhost:4000/auth/reset-password/${token}">Reset Password</a>
    `;
  return template;
};

module.exports = { verifyAccountTemplate, forgotPasswordTemplate };
