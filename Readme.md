# AuthFlow API

AuthFlow API is a robust and secure authentication system built with Node.js and Express.js. It includes modern features such as JWT-based authentication, OAuth integration, and email-based account verification.

## Features

- **Custom Account Creation**: Users can sign up using their email and password.
- **GitHub Sign-In**: OAuth integration for seamless GitHub authentication.
- **Google Sign-In**: OAuth integration for Google account login.
- **Login**: Secure login system with JWT.
- **Update Profile**: Authenticated users can update their profile information.
- **Update Password**: Allows users to securely change their passwords.
- **Reset Password**: Supports password recovery via email link.
- **Get Profile**: Retrieve authenticated user details.
- **Logout**: Securely log out by invalidating the JWT token.
- **Email Notifications**:
  - Verify Account: Send verification emails upon sign-up.
  - Forgot Password: Send recovery emails for resetting forgotten passwords.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AuthFlow-API.git
   ```


2. Navigate to the project directory:
   ```bash
   cd AuthFlow-API
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory and configure the following:
```env
# SERVER CONFIG
PORT=4000
JWT_SECRET=8RSfgxxqcpbzwfjzKKmDjdXqUj64ywBEh6BdK2SADM79feS45WzbyhxjSzh
JWT_SECRET_EXPIRE_TIME="1d"
COOKIE_EXPIRE_TIME=1 # HOURS
ACCOUNT_VERIFY_EXPIRE_TIME=10 # MINUTES
NODE_ENV=development

# DATABASE CONFIG
MONGO_URI=

# GOOGLE API 
G_CLIENT_ID=
G_CLIENT_SECRET=

#GITHUB API
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# MAIL CONFIG
MAIL_PASSWORD=
MAIL_USER=
MAIL_PORT=
```
5. Start the server:
```bash
npm run dev
```

## API Endpoints

### Auth Routes

| Method | Endpoint         | Description                    |
| ------ | ---------------- | ------------------------------ |
| POST   | `/auth/register` | Create a new account           |
| POST   | `/auth/login`    | Log in with email and password |
| POST   | `/auth/google`   | Log in with Google             |
| POST   | `/auth/github`   | Log in with GitHub             |

### User Routes

| Method | Endpoint                | Description                    |
| ------ | ----------------------- | ------------------------------ |
| GET    | `/user/profile`         | Get authenticated user profile |
| PUT    | `/user/profile`  | Update user profile            |
| PUT    | `/user/password` | Update user password           |
| GET   | `/user/logout`   | Log out the current user       |

### Email Routes

| Method | Endpoint                 | Description                     |
| ------ | ------------------------ | ------------------------------- |
| POST   | `/auth/verify-account`  | Send account verification email |
| POST   | `/auth/forgot-password` | Send password reset email       |

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Express.js**: Web application framework.
- **JWT**: Secure token-based authentication.
- **OAuth**: Google and GitHub authentication.
- **Nodemailer**: Email handling for account verification and password reset.
- **MongoDB**: Database for storing user data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to contribute, raise issues, or share feedback to improve this project. 🚀

